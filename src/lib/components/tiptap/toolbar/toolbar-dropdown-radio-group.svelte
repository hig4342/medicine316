<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import type { CommandsGroup } from './types';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { cn } from '$lib/utils';

	interface Props {
		editor: Editor;
		groups: CommandsGroup[];
		value: string;
	}

	const { editor, groups, value }: Props = $props();

	const commands = $derived(groups.flatMap((group) => group.commands));

	function setValue(id: string) {
		const command = commands.find((command) => command.id === id);
		const clickable = command?.clickable?.(editor) ?? true;

		if (command && clickable) {
			command.onClick?.(editor);
		}
	}
</script>

<DropdownMenu.RadioGroup bind:value={() => value, setValue}>
	{#each groups as group (group.id)}
		{#if group.label}
			<DropdownMenu.Label>{group.label}</DropdownMenu.Label>
		{/if}
		{#each group.commands as command (command.id)}
			{@const Icon = command.icon}
			<DropdownMenu.RadioItem
				value={command.id}
				class={cn({ 'cursor-pointer': command.clickable?.(editor) ?? true })}
			>
				<Icon />
				<span class="text-nowrap">{command.label}</span>
				{#if command.shortCut}
					<DropdownMenu.Shortcut>{command.shortCut}</DropdownMenu.Shortcut>
				{/if}
			</DropdownMenu.RadioItem>
		{/each}
	{/each}
</DropdownMenu.RadioGroup>
