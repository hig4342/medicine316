<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import type { Readable } from 'svelte/store';
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
	import { formSchema, type Article } from './schema';
	import { createEditor, Content, type Editor } from '$lib/components/tiptap';
	import {
		CharacterCount,
		Placeholder,
		StarterKit,
		TaskItem,
		TaskList,
		TextAlign,
		Image,
		Youtube,
		ReferArticle
	} from '$lib/components/tiptap/extensions';

	import { Button } from '$lib/components/ui/button';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';
	import { Separator } from '$lib/components/ui/separator';
	import * as Empty from '$lib/components/ui/empty';
	import * as InputGroup from '$lib/components/ui/input-group';

	import Plus from '@lucide/svelte/icons/plus';
	import FileExclamationPoint from '@lucide/svelte/icons/file-exclamation-point';
	import Save from '@lucide/svelte/icons/save';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { resolve } from '$app/paths';

	const { data } = $props();
	let articles = $state(untrack(() => data.articles));
	let disabled = $state(false);
	let saveLoading = $state(false);
	let deleteLoading = $state(false);

	let article = $state<Omit<Article, 'priority'>>();
	let editor = $state<Readable<Editor>>();
	const controller = new DndController();

	controller.onDrop(async ({ item: { id }, target: { position } }) => {
		const fromIndex = articles.findIndex((article) => article.id === id);
		if (fromIndex === -1) return;

		const updated = [...articles];
		const [moved] = updated.splice(fromIndex, 1);
		updated.splice(position, 0, moved);
		const prevArticles = $state.snapshot(articles);
		articles = updated;

		try {
			await fetch('/api/articles/reorder', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ articles: updated.map((article) => article.id) })
			});
		} catch {
			toast.error('글 순서 변경에 실패했습니다.');
			articles = prevArticles; // Revert to previous state on error
		}
	});

	const { form, errors, enhance, constraints } = superForm(
		untrack(() => data.form),
		{
			dataType: 'json',
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
				const prevArticles = $state.snapshot(articles);
				const updatedArticle = form.data;
				if (saveLoading) {
					const contentObj =
						typeof updatedArticle.content === 'string'
							? JSON.parse(updatedArticle.content)
							: updatedArticle.content;
					const refreshedArticles = prevArticles.map((article) => {
						if (article.id === updatedArticle.id && updatedArticle.language === 'ko') {
							return { ...article, ...updatedArticle, content: contentObj };
						}
						return article;
					});
					articles = refreshedArticles;

					const article = prevArticles.find((article) => article.id === updatedArticle.id)!;
					selectArticle({ ...article, ...updatedArticle, content: contentObj });
				} else if (deleteLoading) {
					articles = prevArticles.filter((article) => article.id !== updatedArticle.id);
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
					$editor?.setEditable(false);
					const response = await fetch(`/api/articles/${id}?language=${language}`);
					const data = (await response.json()) as Article;

					event.set('title', data.title);
					event.set('summary', data.summary);
					event.set('slug', data.slug);
					event.set('status', data.status);
					event.set('readingTime', data.readingTime);
					event.set('content', data.content);
					$editor?.commands.setContent(data.content);
					toast.success('언어가 변경되었습니다.');
					disabled = false;
					$editor?.setEditable(true);
				}
			}
		}
	);

	function selectArticle(article: Article) {
		form.set({
			id: article.id,
			language: article.language,
			status: article.status,
			title: article.title,
			summary: article.summary,
			slug: article.slug,
			readingTime: article.readingTime,
			content: article.content
		});
		$editor?.commands.setContent(article.content);
	}

	async function createArticle(event: MouseEvent) {
		event.preventDefault();
		const response = await fetch('/api/articles', { method: 'POST' });
		const newArticle = (await response.json()) as Article;

		console.log('Created Article:', newArticle);

		const prevArticles = $state.snapshot(articles);
		articles = [...prevArticles, newArticle];
		selectArticle(newArticle);
		toast.success('새 글이 생성되었습니다.');
	}

	onMount(() => {
		editor = createEditor({
			extensions: [
				StarterKit,
				CharacterCount,
				Placeholder.configure({
					placeholder: '게시글 본문을 입력하세요...'
				}),
				TaskList,
				TaskItem,
				TextAlign.configure({
					types: ['heading', 'paragraph']
				}),
				Image,
				Youtube.configure({
					ccLanguage: 'ko'
				}),
				ReferArticle
			],
			onUpdate: ({ editor }) => {
				form.set({
					...$form,
					content: editor.getJSON()
				});
			}
		});
	});

	$effect.pre(() => {
		if (!$editor) return;
		if (article?.id === $form.id) return;

		article = $form;
		$editor?.commands.setContent(article.content);
	});
</script>

<div class="flex h-full flex-row">
	<div class="flex w-60 flex-col gap-2 border-r p-2">
		<Button class="w-full cursor-pointer" onclick={createArticle}>
			<Plus class="mr-2 h-4 w-4" />
			새 글 생성
		</Button>
		<Separator />
		<DndProvider {controller}>
			<DndDroppable
				id="articles"
				strategy={sortable()}
				class="flex w-full flex-1 flex-col gap-2 overflow-y-auto"
			>
				{#each articles as article, index (article.id)}
					<DndDraggable id={article.id} position={index}>
						<Button
							href={resolve(`/admin/(authed)/articles?id=${article.id}`)}
							variant={article.id === $form.id ? 'default' : 'outline'}
							class="w-full cursor-pointer"
						>
							<p class="w-full overflow-hidden text-left text-ellipsis whitespace-nowrap">
								{index + 1}. {article.title}
							</p>
						</Button>
					</DndDraggable>
				{/each}
			</DndDroppable>
		</DndProvider>
	</div>
	<form method="POST" action="?/save" class="flex flex-1 flex-col gap-4 p-2" use:enhance>
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
			<div class="grid grid-cols-1 gap-4 md:grid-cols-5">
				<div class="col-span-1 space-y-2 md:col-span-3">
					<Label for="slug">경로</Label>
					<InputGroup.Root>
						<InputGroup.Addon>
							<span class="text-muted-foreground">/</span>
						</InputGroup.Addon>
						<InputGroup.Input
							name="slug"
							bind:value={$form.slug}
							placeholder="경로"
							{...$constraints.slug}
							{disabled}
							required={false}
						/>
					</InputGroup.Root>
					{#if $errors.slug}
						<p class="text-sm text-destructive">{$errors.slug}</p>
					{/if}
				</div>
				<div class="space-y-2">
					<Label for="readingTime">읽는 시간</Label>
					<InputGroup.Root>
						<InputGroup.Input
							name="readingTime"
							type="number"
							bind:value={$form.readingTime}
							placeholder="읽는 시간을 입력해주세요."
							{...$constraints.readingTime}
							{disabled}
						/>
						<InputGroup.Addon align="inline-end">
							<span class="text-muted-foreground">분</span>
						</InputGroup.Addon>
					</InputGroup.Root>
					{#if $errors.readingTime}
						<p class="text-sm text-red-500">{$errors.readingTime}</p>
					{/if}
				</div>
				<div class="space-y-2">
					<Label for="status">상태</Label>
					<Select.Root type="single" name="status" bind:value={$form.status} {disabled}>
						<Select.Trigger class="w-full cursor-pointer">
							{#if $form.status === 'draft'}
								초안
							{:else if $form.status === 'published'}
								게시됨
							{:else if $form.status === 'archived'}
								보관됨
							{/if}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="draft">초안</Select.Item>
							<Select.Item value="published">게시됨</Select.Item>
							<Select.Item value="archived">보관됨</Select.Item>
						</Select.Content>
					</Select.Root>
					{#if $errors.status}
						<p class="text-sm text-red-500">{$errors.status}</p>
					{/if}
				</div>
			</div>
			<div class="space-y-2">
				<Label for="title">제목</Label>
				<Input
					name="title"
					bind:value={$form.title}
					placeholder="제목을 입력해주세요."
					{...$constraints.title}
					{disabled}
				/>
				{#if $errors.title}
					<p class="text-sm text-red-500">{$errors.title}</p>
				{/if}
			</div>
			<div class="space-y-2">
				<Label for="summary">요약</Label>
				<Textarea
					name="summary"
					bind:value={$form.summary}
					placeholder="요약을 입력해주세요."
					{...$constraints.summary}
					{disabled}
				/>
				{#if $errors.summary}
					<p class="text-sm text-red-500">{$errors.summary}</p>
				{/if}
			</div>
			<div class="flex flex-1 flex-col gap-2">
				<Label for="content">내용</Label>
				{#if $editor}
					<Content editor={$editor} {articles} />
				{/if}
				{#if $errors.content}
					<p class="text-sm text-red-500">{$errors.content}</p>
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
					<Empty.Title>선택된 글이 없습니다.</Empty.Title>
					<Empty.Description>
						좌측의 목록에서 글을 선택하거나 새 글을 만들어보세요.
					</Empty.Description>
				</Empty.Header>
				<Empty.Content>
					<Button class="cursor-pointer" onclick={createArticle}>
						<Plus />
						새 글 생성
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
