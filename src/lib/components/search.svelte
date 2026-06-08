<script lang="ts">
	import { resolve } from '$app/paths';
	import type { LocalizedArticle } from '$lib/types';
	import { cmdOrCtrl } from '$lib/hooks/is-mac.svelte';
	import * as Command from '$lib/components/ui/command';
	import { Button } from '$lib/components/ui/button';
	import * as Kbd from '$lib/components/ui/kbd';
	import { m } from '$lib/paraglide/messages';

	interface Props {
		articles: LocalizedArticle[];
		onclick?: () => void;
	}

	let { articles, onclick }: Props = $props();

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
	<span>{m['search.placeholder']()}</span>
	<Kbd.Group>
		<Kbd.Root>{cmdOrCtrl}</Kbd.Root>
		+
		<Kbd.Root>K</Kbd.Root>
	</Kbd.Group>
</Button>

<Command.Dialog bind:open>
	<Command.Input placeholder={m['search.placeholder']()} />
	<Command.List>
		<Command.Empty>{m['search.noResults']()}</Command.Empty>
		<Command.Group heading={m['search.articles']()}>
			{#each articles as article (article.id)}
				<Command.LinkItem
					class="cursor-pointer"
					href={resolve('/(app)/[...slug]', { slug: article.slug })}
					onclick={() => {
						open = false;
						onclick?.();
					}}
				>
					<span>{article.title}</span>
				</Command.LinkItem>
			{/each}
		</Command.Group>
	</Command.List>
</Command.Dialog>
