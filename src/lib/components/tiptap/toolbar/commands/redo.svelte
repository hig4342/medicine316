<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { isMac } from '$lib/utils';
	import Redo from '@lucide/svelte/icons/redo';
	import ToolBarButton from '../toolbar-button.svelte';
	import type { ToolBarCommand } from '../types';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();

	const command = $derived<ToolBarCommand>({
		id: 'redo',
		icon: Redo,
		label: '다시 실행',
		shortCut: isMac ? '⌘Y' : 'Ctrl+Y',
		onClick: (editor) => editor.chain().focus().redo().run(),
		clickable: (editor) => editor.can().redo()
	});
</script>

<ToolBarButton {editor} {command} />
