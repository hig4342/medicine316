<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { isMac } from '$lib/utils';
	import Undo from '@lucide/svelte/icons/undo';
	import ToolBarButton from '../toolbar-button.svelte';
	import type { ToolBarCommand } from '../types';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();

	const command = $derived<ToolBarCommand>({
		id: 'undo',
		icon: Undo,
		label: '실행 취소',
		shortCut: isMac ? '⌘Z' : 'Ctrl+Z',
		onClick: (editor) => editor.chain().focus().undo().run(),
		clickable: (editor) => editor.can().undo()
	});
</script>

<ToolBarButton {editor} {command} />
