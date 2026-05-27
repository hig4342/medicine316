<script lang="ts">
	import { cmdOrCtrl } from '$lib/hooks/is-mac.svelte';
	import * as Command from '$lib/components/ui/command';
	import { Button } from '$lib/components/ui/button';
	import * as Kbd from '$lib/components/ui/kbd';

	let open = $state(false);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			open = !open;
		}
	}
</script>

<svelte:document onkeydown={handleKeydown} />

<Button
	variant="outline"
	class="flex w-full cursor-pointer justify-between text-muted-foreground"
	onclick={() => (open = true)}
>
	<span>Search...</span>
	<Kbd.Group>
		<Kbd.Root>{cmdOrCtrl}</Kbd.Root>
		+
		<Kbd.Root>K</Kbd.Root>
	</Kbd.Group>
</Button>

<Command.Dialog bind:open>
	<Command.Input placeholder="Search..." />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>
		<Command.Group>
			<Command.Item>
				<span>Calendar</span>
			</Command.Item>
			<Command.Item>
				<span>Search Emoji</span>
			</Command.Item>
			<Command.Item>
				<span>Calculator</span>
			</Command.Item>
		</Command.Group>
	</Command.List>
</Command.Dialog>
