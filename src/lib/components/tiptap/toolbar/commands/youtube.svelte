<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { SiYoutube } from '@icons-pack/svelte-simple-icons';
	import ToolbarPopover from '../toolbar-popover.svelte';
	import type { ToolBarCommand } from '../types';
	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import { isValidYoutubeUrl } from '@tiptap/extension-youtube';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();

	let url = $state<string>('');

	const command = $derived<ToolBarCommand>({
		id: 'youtube',
		icon: SiYoutube,
		label: '유튜브 비디오 삽입',
		onClick: (editor) => {
			if (!url) return;

			editor.chain().focus().setYoutubeVideo({ src: url }).run();
			url = '';
		},
		clickable: () => (isValidYoutubeUrl(url) ?? []).length > 0
	});

	const Icon = $derived(command.icon);
	const onclick = $derived(command.onClick!);
	const clickable = $derived(command.clickable?.(editor) ?? true);
</script>

<ToolbarPopover tooltip={command.label}>
	{#snippet icon()}
		<Icon />
	{/snippet}
	{#snippet contents()}
		<div class="flex flex-row items-center gap-2">
			<Input class="w-52" bind:value={url} />
			<Button
				class={cn({ 'cursor-pointer': clickable })}
				onclick={() => onclick(editor)}
				disabled={!clickable}
			>
				유튜브 비디오 삽입
			</Button>
		</div>
	{/snippet}
</ToolbarPopover>
