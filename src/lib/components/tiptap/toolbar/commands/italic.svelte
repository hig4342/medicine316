<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { isMac } from '$lib/utils';
	import Italic from '@lucide/svelte/icons/italic';
	import ToolBarButton from '../toolbar-button.svelte';
	import type { ToolBarCommand } from '../types';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();

	const command = $derived<ToolBarCommand>({
		id: 'italic',
		icon: Italic,
		label: '기울임',
		shortCut: isMac ? '⌘I' : 'Ctrl+I',
		onClick: (editor) => editor.chain().focus().toggleItalic().run(),
		clickable: (editor) => editor.can().toggleItalic(),
		isActive: (editor) => editor.isActive('italic')
	});
</script>

<ToolBarButton {editor} {command} />
