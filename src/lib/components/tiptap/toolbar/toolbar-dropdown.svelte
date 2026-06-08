<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
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

<DropdownMenu.Root>
	<CommandTooltip {tooltip}>
		<DropdownMenu.Trigger
			class={buttonVariants({
				variant: 'ghost',
				size: 'icon',
				class: cn('cursor-pointer gap-0 border-0 p-0 ring-0')
			})}
		>
			{@render icon()}
			<ChevronDown class="size-2 text-muted-foreground" />
		</DropdownMenu.Trigger>
	</CommandTooltip>
	<DropdownMenu.Content class="w-min">
		{@render contents()}
	</DropdownMenu.Content>
</DropdownMenu.Root>
