<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { toast } from 'svelte-sonner';
	import { cn } from '$lib/utils';
	import ToolbarPopover from '../toolbar-popover.svelte';
	import type { ToolBarCommand } from '../types';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';
	import ImagePlus from '@lucide/svelte/icons/image-plus';
	import { Spinner } from '$lib/components/ui/spinner';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();

	let value = $state<'upload' | 'link'>('upload');
	let url = $state<string>('');
	let files = $state<FileList>();
	let hasError = $state(false);
	let loading = $state(false);

	const command = $derived<ToolBarCommand>({
		id: 'image-file-drop',
		icon: ImagePlus,
		label: '이미지 삽입'
	});

	const Icon = $derived(command.icon);
	// const onclick = $derived(command.onClick!);
	// const clickable = $derived(command.clickable?.(editor) ?? true);

	async function addImageByUpload(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) {
		event.preventDefault();
		if (!files || files.length === 0) {
			toast.error('업로드할 이미지를 선택해주세요.');
			return;
		}

		if (files.length > 1) {
			toast.error('한 번에 하나의 이미지만 업로드할 수 있습니다.');
			return;
		}

		if (files[0].size > 5 * 1024 * 1024) {
			toast.error('이미지 크기는 5MB를 초과할 수 없습니다.');
			return;
		}

		const formData = new FormData();
		formData.append('file', files[0]);

		try {
			loading = true;
			const response = await fetch('/api/upload-image', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				toast.error('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
				return;
			}

			const data = (await response.json()) as { url: string };

			editor.chain().focus().setImage({ src: data.url }).run();
		} catch (error) {
			console.error('이미지 업로드 중 오류 발생:', error);
		} finally {
			loading = false;
		}
	}

	function addImageByLink() {
		if (!url) return;

		editor.chain().focus().setImage({ src: url }).run();
	}
</script>

<ToolbarPopover tooltip={command.label}>
	{#snippet icon()}
		<Icon />
	{/snippet}
	{#snippet contents()}
		<div class="flex flex-row items-center gap-2">
			<Tabs.Root bind:value>
				<Tabs.List>
					<Tabs.Trigger value="upload" class="cursor-pointer">업로드</Tabs.Trigger>
					<Tabs.Trigger value="link" class="cursor-pointer">링크 삽입</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="upload" class="w-80">
					<form
						method="POST"
						enctype="multipart/form-data"
						onsubmit={addImageByUpload}
						class="flex flex-col gap-2"
					>
						{#if files && files.length > 0}
							<img
								src={URL.createObjectURL(files[0])}
								alt="이미지 미리보기"
								class={cn('max-h-48 w-full object-contain', hasError ? 'hidden' : 'block')}
								onload={() => {
									hasError = false;
								}}
								onerror={() => {
									hasError = true;
								}}
							/>
						{/if}
						<Input name="file" type="file" class="cursor-pointer" bind:files />
						<Button type="submit" class="w-full cursor-pointer" disabled={loading}>
							{#if loading}
								<Spinner />
								로딩 중...
							{:else}
								이미지 업로드 후 삽입
							{/if}
						</Button>
					</form>
				</Tabs.Content>
				<Tabs.Content value="link" class="flex w-80 flex-col gap-2">
					{#if url}
						<img
							src={url}
							alt="이미지 미리보기"
							class={cn('max-h-48 w-full object-contain', hasError ? 'hidden' : 'block')}
							onload={() => {
								hasError = false;
							}}
							onerror={() => {
								hasError = true;
							}}
						/>
					{/if}
					<Input
						type="text"
						bind:value={url}
						disabled={hasError}
						placeholder="이미지 URL을 입력하세요."
					/>
					<Button class="w-full cursor-pointer" onclick={addImageByLink}>이미지 링크 삽입</Button>
				</Tabs.Content>
			</Tabs.Root>
		</div>
	{/snippet}
</ToolbarPopover>
