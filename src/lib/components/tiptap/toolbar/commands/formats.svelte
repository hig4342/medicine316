<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { m } from '$lib/paraglide/messages';
	import { isMac } from '$lib/utils';
	import ToolbarDropdown from '../toolbar-dropdown.svelte';
	import ToolbarDropdownRadioGroup from '../toolbar-dropdown-radio-group.svelte';
	import type { CommandsGroup } from '../types';
	import Pilcrow from '@lucide/svelte/icons/pilcrow';
	import Heading1 from '@lucide/svelte/icons/heading-1';
	import Heading2 from '@lucide/svelte/icons/heading-2';
	import Heading3 from '@lucide/svelte/icons/heading-3';
	import Heading4 from '@lucide/svelte/icons/heading-4';
	import List from '@lucide/svelte/icons/list';
	import ListOrdered from '@lucide/svelte/icons/list-ordered';
	import ListChecks from '@lucide/svelte/icons/list-checks';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();

	const groups: CommandsGroup[] = [
		{
			id: 'default',
			label: '기본 블록',
			commands: [
				{
					id: 'paragraph',
					label: '문단',
					icon: Pilcrow,
					shortCut: `${isMac ? '⌘⌥' : 'Ctrl+Alt+'}0`,
					onClick: (editor) => editor.chain().focus().setParagraph().run(),
					clickable: (editor) => editor.can().setParagraph(),
					isActive: (editor) => editor.isActive('paragraph')
				},
				{
					id: 'h1',
					label: '제목 1',
					icon: Heading1,
					shortCut: `${isMac ? '⌘⌥' : 'Ctrl+Alt+'}1`,
					onClick: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
					clickable: (editor) => editor.can().toggleHeading({ level: 1 }),
					isActive: (editor: Editor) => editor.isActive('heading', { level: 1 })
				},
				{
					id: 'h2',
					label: '제목 2',
					icon: Heading2,
					shortCut: `${isMac ? '⌘⌥' : 'Ctrl+Alt+'}2`,
					onClick: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
					clickable: (editor) => editor.can().toggleHeading({ level: 2 }),
					isActive: (editor: Editor) => editor.isActive('heading', { level: 2 })
				},
				{
					id: 'h3',
					label: '제목 3',
					icon: Heading3,
					shortCut: `${isMac ? '⌘⌥' : 'Ctrl+Alt+'}3`,
					onClick: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
					clickable: (editor) => editor.can().toggleHeading({ level: 3 }),
					isActive: (editor: Editor) => editor.isActive('heading', { level: 3 })
				},
				{
					id: 'h4',
					label: '제목 4',
					icon: Heading4,
					shortCut: `${isMac ? '⌘⌥' : 'Ctrl+Alt+'}4`,
					onClick: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 4 }).run(),
					clickable: (editor) => editor.can().toggleHeading({ level: 4 }),
					isActive: (editor: Editor) => editor.isActive('heading', { level: 4 })
				}
			]
		},
		{
			id: 'list',
			label: '목록',
			commands: [
				{
					id: 'bulletList',
					label: '글머리 기호 목록',
					icon: List,
					shortCut: `${isMac ? '⌘⇧' : 'Ctrl+Shift+'}8`,
					onClick: (editor: Editor) => editor.chain().focus().toggleBulletList().run(),
					clickable: (editor) => editor.can().toggleBulletList(),
					isActive: (editor: Editor) => editor.isActive('bulletList')
				},
				{
					id: 'orderedList',
					label: '번호 매기기 목록',
					icon: ListOrdered,
					shortCut: `${isMac ? '⌘⇧' : 'Ctrl+Shift+'}9`,
					onClick: (editor: Editor) => editor.chain().focus().toggleOrderedList().run(),
					clickable: (editor) => editor.can().toggleOrderedList(),
					isActive: (editor: Editor) => editor.isActive('orderedList')
				},
				{
					id: 'taskList',
					label: '할 일 목록',
					icon: ListChecks,
					shortCut: `${isMac ? '⌘⇧' : 'Ctrl+Shift+'}0`,
					onClick: (editor: Editor) => editor.chain().focus().toggleTaskList().run(),
					clickable: (editor) => editor.can().toggleTaskList(),
					isActive: (editor: Editor) => editor.isActive('taskList')
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

<ToolbarDropdown tooltip={m['toolbar.formats']()}>
	{#snippet icon()}
		<Icon />
	{/snippet}
	{#snippet contents()}
		<ToolbarDropdownRadioGroup {editor} {groups} {value} />
	{/snippet}
</ToolbarDropdown>
