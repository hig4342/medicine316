<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { isMac } from '$lib/utils';
	import Underline from '@lucide/svelte/icons/underline';
	import ToolBarButton from '../toolbar-button.svelte';
	import type { ToolBarCommand } from '../types';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();

	const command = $derived<ToolBarCommand>({
		id: 'underline',
		icon: Underline,
		label: '밑줄',
		shortCut: isMac ? '⌘U' : 'Ctrl+U',
		onClick: (editor) => editor.chain().focus().toggleUnderline().run(),
		clickable: (editor) => editor.can().toggleUnderline(),
		isActive: (editor) => editor.isActive('underline')
	});
</script>

<ToolBarButton {editor} {command} />
