<script lang="ts">
	import { SvelteMap } from 'svelte/reactivity';
	import { fade } from 'svelte/transition';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { cn } from '$lib/utils';
	import type { LocalizedArticle } from '$lib/types';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import ArticleTree from '$lib/components/article-tree.svelte';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	interface Props {
		articles: LocalizedArticle[];
		rootId?: string | null;
		onSelect?: (event: MouseEvent, article: LocalizedArticle) => void;
	}

	const { articles, rootId = null, onSelect }: Props = $props();

	const rootArticles = $derived(articles.filter((article) => article.parentId === rootId));

	let opens = new SvelteMap<string, boolean>();
</script>

<ul class="space-y-1">
	{#each rootArticles as article (article.id)}
		{@const children = articles.filter((a) => a.parentId === article.id)}

		<li>
			<Collapsible.Root
				class="space-y-2"
				open={opens.has(article.id) ? opens.get(article.id) : true}
			>
				<a
					href={resolve('/(app)/[...slug]', { slug: article.slug })}
					data-active={article.slug === page.params.slug}
					class={cn(
						'group flex items-center justify-between rounded-md bg-background p-2 text-sm transition hover:bg-accent',
						'data-active:bg-primary! data-active:text-primary-foreground'
					)}
					onclick={(e) => onSelect?.(e, article)}
				>
					{article.title}
					{#if children.length > 0}
						<Collapsible.Trigger
							class={cn(
								'group cursor-pointer rounded-sm p-1 hover:bg-muted-foreground/10 group-data-active:hover:bg-muted-foreground/50'
							)}
							onclick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								const isOpen = opens.getOrInsert(article.id, true);
								opens.set(article.id, !isOpen);
							}}
						>
							<ChevronRight class="size-3 transition group-data-[state=open]:rotate-90" />
						</Collapsible.Trigger>
					{/if}
				</a>
				{#if children.length > 0}
					<Collapsible.Content
						forceMount
						class="ml-4 overflow-hidden border-l pl-2 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
					>
						{#snippet child({ props, open })}
							{#if open}
								<div {...props} transition:fade={{ duration: 200 }}>
									<ArticleTree {articles} rootId={article.id} {onSelect} />
								</div>
							{/if}
						{/snippet}
					</Collapsible.Content>
				{/if}
			</Collapsible.Root>
		</li>
	{/each}
</ul>
