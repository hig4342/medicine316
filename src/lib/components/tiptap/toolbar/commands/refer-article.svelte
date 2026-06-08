<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import ToolbarPopover from '../toolbar-popover.svelte';
	import type { ToolBarCommand } from '../types';
	import * as Select from '$lib/components/ui/select';
	import Button from '$lib/components/ui/button/button.svelte';
	import FileSymlink from '@lucide/svelte/icons/file-symlink';
	import { cn } from '$lib/utils';
	import type { LocalizedArticle } from '$lib/types';

	interface Props {
		editor: Editor;
		articles: Pick<LocalizedArticle, 'id' | 'title'>[];
	}

	const { editor, articles }: Props = $props();

	let articleId = $state<string>();

	const command = $derived<ToolBarCommand>({
		id: 'article',
		icon: FileSymlink,
		label: '게시글 참조',
		onClick: (editor) => {
			if (!articleId) return;

			editor.chain().focus().setReferArticle({ articleId }).run();
			articleId = '';
		},
		clickable: () => !!articleId
	});

	const Icon = $derived(command.icon);
	const onclick = $derived(command.onClick!);
	const clickable = $derived(command.clickable?.(editor) ?? true);
	const selectedArticle = $derived(articles.find((article) => article.id === articleId));
</script>

<ToolbarPopover tooltip={command.label}>
	{#snippet icon()}
		<Icon />
	{/snippet}
	{#snippet contents()}
		<div class="flex flex-row items-center gap-2">
			<Select.Root type="single" bind:value={articleId}>
				<Select.Trigger class="cursor-pointer">
					{selectedArticle ? selectedArticle.title : '문서를 선택하세요'}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>문서</Select.Label>
						{#each articles as article (article.id)}
							<Select.Item class="cursor-pointer" value={article.id}>
								{article.title}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
			<Button
				class={cn({ 'cursor-pointer': clickable })}
				disabled={!clickable}
				onclick={() => onclick(editor)}>삽입</Button
			>
		</div>
	{/snippet}
</ToolbarPopover>
