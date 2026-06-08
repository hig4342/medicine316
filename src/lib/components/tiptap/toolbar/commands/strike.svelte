<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { isMac } from '$lib/utils';
	import Strikethrough from '@lucide/svelte/icons/strikethrough';
	import ToolBarButton from '../toolbar-button.svelte';
	import type { ToolBarCommand } from '../types';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();

	const command = $derived<ToolBarCommand>({
		id: 'strikethrough',
		icon: Strikethrough,
		label: '취소선',
		shortCut: isMac ? '⌘S' : 'Ctrl+S',
		onClick: (editor) => editor.chain().focus().toggleStrike().run(),
		clickable: (editor) => editor.can().toggleStrike(),
		isActive: (editor) => editor.isActive('strike')
	});
</script>

<ToolBarButton {editor} {command} />
