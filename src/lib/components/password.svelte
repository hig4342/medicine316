<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import * as InputGroup from '$lib/components/ui/input-group';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeClosed from '@lucide/svelte/icons/eye-closed';

	type Props = { open?: boolean } & ComponentProps<typeof InputGroup.Input>;

	let { open = $bindable(false), value = $bindable(), ...props }: Props = $props();

	function toggleOpen() {
		open = !open;
	}
</script>

<InputGroup.Root data-open={open} class="group">
	<InputGroup.Input type={open ? 'text' : 'password'} bind:value {...props} />
	<InputGroup.Addon align="inline-end">
		<InputGroup.Button onclick={toggleOpen}>
			<EyeClosed class="scale-100 transition-all! group-data-open:scale-0" />
			<Eye class="absolute scale-0 transition-all! group-data-open:scale-100" />
		</InputGroup.Button>
	</InputGroup.Addon>
</InputGroup.Root>
