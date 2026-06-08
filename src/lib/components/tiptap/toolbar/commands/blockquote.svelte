<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { isMac } from '$lib/utils';
	import Quote from '@lucide/svelte/icons/quote';
	import ToolBarButton from '../toolbar-button.svelte';
	import type { ToolBarCommand } from '../types';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();

	const command = $derived<ToolBarCommand>({
		id: 'blockquote',
		icon: Quote,
		label: '인용',
		shortCut: isMac ? '⌘B' : 'Ctrl+B',
		onClick: (editor) => editor.chain().focus().toggleBlockquote().run(),
		clickable: (editor) => editor.can().toggleBlockquote(),
		isActive: (editor) => editor.isActive('blockquote')
	});
</script>

<ToolBarButton {editor} {command} />
