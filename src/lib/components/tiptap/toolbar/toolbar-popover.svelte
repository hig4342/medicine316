<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils.js';
	import * as Popover from '$lib/components/ui/popover';
	import { buttonVariants } from '$lib/components/ui/button';
	import CommandTooltip from './command-tooltip.svelte';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';

	interface Props {
		tooltip: string;
		icon: Snippet;
		contents: Snippet;
	}

	const { tooltip, icon, contents }: Props = $props();
</script>

<Popover.Root>
	<CommandTooltip {tooltip}>
		<Popover.Trigger
			class={buttonVariants({
				variant: 'ghost',
				size: 'icon',
				class: cn('cursor-pointer gap-0 border-0 p-0 ring-0')
			})}
		>
			{@render icon()}
			<ChevronDown class="size-2 text-muted-foreground" />
		</Popover.Trigger>
	</CommandTooltip>
	<Popover.Content class="w-min p-2">
		{@render contents()}
	</Popover.Content>
</Popover.Root>
