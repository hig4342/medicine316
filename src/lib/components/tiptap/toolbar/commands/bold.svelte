<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { isMac } from '$lib/utils';
	import Bold from '@lucide/svelte/icons/bold';
	import ToolBarButton from '../toolbar-button.svelte';
	import type { ToolBarCommand } from '../types';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();

	const command = $derived<ToolBarCommand>({
		id: 'bold',
		icon: Bold,
		label: '굵게',
		shortCut: isMac ? '⌘B' : 'Ctrl+B',
		onClick: (editor) => editor.chain().focus().toggleBold().run(),
		clickable: (editor) => editor.can().toggleBold(),
		isActive: (editor) => editor.isActive('bold')
	});
</script>

<ToolBarButton {editor} {command} />
