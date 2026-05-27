<script lang="ts">
	import { untrack } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import {
		DndProvider,
		DndDroppable,
		DndDraggable,
		DndController,
		sortable
	} from '@horuse/svelte-dnd';
	import { toast } from 'svelte-sonner';
	import { locales } from '$lib/paraglide/runtime';
	import { formSchema, type FAQ } from './schema';

	import { Button } from '$lib/components/ui/button';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';
	import { Separator } from '$lib/components/ui/separator';
	import * as Empty from '$lib/components/ui/empty';

	import Plus from '@lucide/svelte/icons/plus';
	import FileExclamationPoint from '@lucide/svelte/icons/file-exclamation-point';
	import Save from '@lucide/svelte/icons/save';
	import Trash2 from '@lucide/svelte/icons/trash-2';

	const { data } = $props();
	let faqs = $state(untrack(() => data.faqs));
	let disabled = $state(false);
	let saveLoading = $state(false);
	let deleteLoading = $state(false);

	const controller = new DndController();

	controller.onDrop(async ({ item: { id }, target: { position } }) => {
		const fromIndex = faqs.findIndex((faq) => faq.id === id);
		if (fromIndex === -1) return;

		const updated = [...faqs];
		const [moved] = updated.splice(fromIndex, 1);
		updated.splice(position, 0, moved);
		const prevFaqs = $state.snapshot(faqs);
		faqs = updated;

		try {
			await fetch('/api/faqs/reorder', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ faqs: updated.map((faq) => faq.id) })
			});
		} catch {
			toast.error('FAQ 순서 변경에 실패했습니다.');
			faqs = prevFaqs; // Revert to previous state on error
		}
	});

	const { form, errors, enhance, constraints } = superForm(
		untrack(() => data.form),
		{
			validators: valibotClient(formSchema),
			onSubmit: ({ action }) => {
				disabled = true;
				const isSave = action.search === '?/save';
				if (isSave) {
					saveLoading = true;
				} else {
					deleteLoading = true;
				}
			},
			onUpdated: ({ form }) => {
				const prevFaqs = $state.snapshot(faqs);
				const updatedFaq = form.data;
				if (saveLoading) {
					const refreshedFaqs = prevFaqs.map((faq) => {
						if (faq.id === updatedFaq.id && updatedFaq.language === 'ko') {
							return { ...faq, ...updatedFaq };
						}
						return faq;
					});
					faqs = refreshedFaqs;

					const faq = prevFaqs.find((faq) => faq.id === updatedFaq.id)!;
					selectFaq({ ...faq, ...updatedFaq });
				} else if (deleteLoading) {
					faqs = prevFaqs.filter((faq) => faq.id !== updatedFaq.id);
				}
				disabled = false;
				saveLoading = false;
				deleteLoading = false;
			},
			onChange: async (event) => {
				if (event.paths.length === 1 && event.paths[0] === 'language') {
					const id = event.get('id');
					const language = event.get('language');

					disabled = true;
					const response = await fetch(`/api/faqs/${id}?language=${language}`);
					const data = (await response.json()) as FAQ;

					event.set('question', data.question);
					event.set('answer', data.answer);
					toast.success('언어가 변경되었습니다.');
					disabled = false;
				}
			}
		}
	);

	function selectFaq(faq: FAQ) {
		form.set({
			id: faq.id,
			language: faq.language,
			question: faq.question,
			answer: faq.answer
		});
	}

	async function createFaq(event: MouseEvent) {
		event.preventDefault();
		const response = await fetch('/api/faqs', { method: 'POST' });
		const newFaq = (await response.json()) as FAQ;

		console.log('Created FAQ:', newFaq);

		const prevFaqs = $state.snapshot(faqs);
		faqs = [...prevFaqs, newFaq];
		selectFaq(newFaq);
		toast.success('새 FAQ가 생성되었습니다.');
	}
</script>

<div class="flex h-full flex-row">
	<div class="flex w-52 flex-col gap-2 border-r p-2">
		<Button class="w-full cursor-pointer" onclick={createFaq}>
			<Plus class="mr-2 h-4 w-4" />
			새 FAQ 생성
		</Button>
		<Separator />
		<DndProvider {controller}>
			<DndDroppable
				id="faqs"
				strategy={sortable()}
				class="flex w-full flex-1 flex-col gap-2 overflow-y-auto"
			>
				{#each faqs as faq, index (faq.id)}
					<DndDraggable id={faq.id} position={index}>
						<Button
							variant={faq.id === $form.id ? 'default' : 'outline'}
							class="w-full cursor-pointer"
							onclick={() => selectFaq(faq)}
						>
							<p class="w-full overflow-hidden text-left text-ellipsis whitespace-nowrap">
								{index + 1}. {faq.question}
							</p>
						</Button>
					</DndDraggable>
				{/each}
			</DndDroppable>
		</DndProvider>
	</div>
	<form method="POST" action="?/save" class="flex-1 space-y-4 p-2" use:enhance>
		{#if $form.id}
			<input type="hidden" name="id" value={$form.id} />
			<div class="space-y-2">
				<Label for="language">언어</Label>
				<Select.Root type="single" name="language" bind:value={$form.language} {disabled}>
					<Select.Trigger class="w-full cursor-pointer">
						{new Intl.DisplayNames(['ko'], { type: 'language' }).of($form.language) ||
							'언어를 선택해주세요.'}
					</Select.Trigger>
					<Select.Content>
						{#each locales as locale (locale)}
							<Select.Item value={locale}>
								{new Intl.DisplayNames(['ko'], { type: 'language' }).of(locale)}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				{#if $errors.language}
					<p class="text-sm text-red-500">{$errors.language}</p>
				{/if}
			</div>
			<div class="space-y-2">
				<Label for="question">질문</Label>
				<Textarea
					name="question"
					bind:value={$form.question}
					placeholder="질문을 입력해주세요."
					{...$constraints.question}
					{disabled}
				/>
				{#if $errors.question}
					<p class="text-sm text-red-500">{$errors.question}</p>
				{/if}
			</div>
			<div class="space-y-2">
				<Label for="answer">답변</Label>
				<Textarea
					name="answer"
					bind:value={$form.answer}
					placeholder="답변을 입력해주세요."
					{...$constraints.answer}
					{disabled}
				/>
				{#if $errors.answer}
					<p class="text-sm text-red-500">{$errors.answer}</p>
				{/if}
			</div>
			<div class="space-y-2">
				<Button type="submit" class="w-full cursor-pointer" {disabled}>
					{#if saveLoading}
						<Spinner />
						저장 중...
					{:else}
						<Save />
						저장하기
					{/if}
				</Button>
				<Button
					variant="destructive"
					type="submit"
					class="w-full cursor-pointer"
					formaction="?/delete"
					{disabled}
				>
					{#if deleteLoading}
						<Spinner />
						삭제 중...
					{:else}
						<Trash2 />
						삭제하기
					{/if}
				</Button>
			</div>
		{:else}
			<Empty.Root class="h-full border">
				<Empty.Header>
					<Empty.Media variant="icon">
						<FileExclamationPoint />
					</Empty.Media>
					<Empty.Title>선택된 FAQ가 없습니다.</Empty.Title>
					<Empty.Description>
						좌측의 목록에서 FAQ를 선택하거나 새 FAQ를 만들어보세요.
					</Empty.Description>
				</Empty.Header>
				<Empty.Content>
					<Button class="cursor-pointer" onclick={createFaq}>
						<Plus />
						새 FAQ 생성
					</Button>
				</Empty.Content>
			</Empty.Root>
		{/if}
	</form>
</div>

<style lang="postcss">
	@reference '#layout.css';

	:root {
		--dnd-preview-bg: var(--color-card);
		--dnd-preview-border: 1.5px dashed var(--border);
		--dnd-preview-border-radius: var(--radius-md);
	}
</style>
