<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import type { ToolBarCommand } from './types';
	import { Button } from '$lib/components/ui/button';
	import CommandTooltip from './command-tooltip.svelte';
	import { cn } from '$lib/utils';

	interface Props {
		editor: Editor;
		command: ToolBarCommand;
	}

	const { editor, command }: Props = $props();

	const tooltip = $derived(command.label);
	const shortCut = $derived(command.shortCut);
	const onClick = $derived(command.onClick ?? (() => {}));
	const isActive = $derived.by(() => command.isActive?.(editor) ?? false);
	const clickable = $derived.by(() => command.clickable?.(editor) ?? true);
	const Icon = $derived(command.icon);
</script>

<CommandTooltip {tooltip} {shortCut}>
	<Button
		variant={isActive ? 'default' : 'ghost'}
		size="icon"
		onclick={() => onClick(editor)}
		disabled={!clickable}
		class={cn({ 'cursor-pointer': clickable, 'pointer-events-none': !clickable })}
	>
		<Icon />
	</Button>
</CommandTooltip>
