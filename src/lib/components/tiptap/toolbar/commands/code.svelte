<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { isMac } from '$lib/utils';
	import Code from '@lucide/svelte/icons/code';
	import ToolBarButton from '../toolbar-button.svelte';
	import type { ToolBarCommand } from '../types';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();

	const command = $derived<ToolBarCommand>({
		id: 'code',
		icon: Code,
		label: '인라인 코드',
		shortCut: isMac ? '⌘B' : 'Ctrl+B',
		onClick: (editor) => editor.chain().focus().toggleCode().run(),
		clickable: (editor) => editor.can().toggleCode(),
		isActive: (editor) => editor.isActive('code')
	});
</script>

<ToolBarButton {editor} {command} />
