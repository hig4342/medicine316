<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { isMac } from '$lib/utils';
	import type { CommandsGroup } from '../types';
	import ToolbarDropdown from '../toolbar-dropdown.svelte';
	import ToolbarDropdownRadioGroup from '../toolbar-dropdown-radio-group.svelte';
	import TextAlignStart from '@lucide/svelte/icons/text-align-start';
	import TextAlignCenter from '@lucide/svelte/icons/text-align-center';
	import TextAlignEnd from '@lucide/svelte/icons/text-align-end';
	import TextAlignJustify from '@lucide/svelte/icons/text-align-justify';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();

	const groups: CommandsGroup[] = [
		{
			id: 'alignments',
			label: '정렬',
			commands: [
				{
					id: 'alignLeft',
					label: '왼쪽 정렬',
					icon: TextAlignStart,
					shortCut: `${isMac ? '⌘⇧' : 'Ctrl+Shift+'}L`,
					onClick: (editor) => editor.chain().focus().toggleTextAlign('left').run(),
					clickable: (editor) => editor.can().toggleTextAlign('left'),
					isActive: (editor) => editor.isActive({ textAlign: 'left' })
				},
				{
					id: 'alignCenter',
					label: '가운데 정렬',
					icon: TextAlignCenter,
					shortCut: `${isMac ? '⌘⇧' : 'Ctrl+Shift+'}E`,
					onClick: (editor: Editor) => editor.chain().focus().toggleTextAlign('center').run(),
					clickable: (editor) => editor.can().toggleTextAlign('center'),
					isActive: (editor: Editor) => editor.isActive({ textAlign: 'center' })
				},
				{
					id: 'alignRight',
					label: '오른쪽 정렬',
					icon: TextAlignEnd,
					shortCut: `${isMac ? '⌘⇧' : 'Ctrl+Shift+'}R`,
					onClick: (editor: Editor) => editor.chain().focus().toggleTextAlign('right').run(),
					clickable: (editor) => editor.can().toggleTextAlign('right'),
					isActive: (editor: Editor) => editor.isActive({ textAlign: 'right' })
				},
				{
					id: 'alignJustify',
					label: '양쪽 정렬',
					icon: TextAlignJustify,
					shortCut: `${isMac ? '⌘⇧' : 'Ctrl+Shift+'}J`,
					onClick: (editor: Editor) => editor.chain().focus().toggleTextAlign('justify').run(),
					clickable: (editor) => editor.can().toggleTextAlign('justify'),
					isActive: (editor: Editor) => editor.isActive({ textAlign: 'justify' })
				}
			]
		}
	];

	const commands = $derived(groups.flatMap((group) => group.commands));
	const command = $derived.by(
		() => commands.find((command) => command.isActive?.(editor)) ?? commands[0]
	);
	const value = $derived(command.id);
	const Icon = $derived(command.icon);
</script>

<ToolbarDropdown tooltip="정렬">
	{#snippet icon()}
		<Icon />
	{/snippet}
	{#snippet contents()}
		<ToolbarDropdownRadioGroup {editor} {groups} {value} />
	{/snippet}
</ToolbarDropdown>
