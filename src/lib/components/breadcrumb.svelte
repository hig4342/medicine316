<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import type { LocalizedArticle } from '$lib/types';

	interface Props {
		articles: LocalizedArticle[];
		article: LocalizedArticle;
	}

	let { articles, article }: Props = $props();
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		{#each article.slug.split('/') as slug, index (index)}
			{@const target = articles.find(({ slug: s }) => s.split('/').at(-1) === slug)}
			{#if index !== 0}
				<Breadcrumb.Separator />
			{/if}
			{#if target}
				<Breadcrumb.Item
					class="data-active:font-bold data-active:text-primary"
					data-active={target.slug === page.params.slug}
				>
					<Breadcrumb.Link href={resolve('/(app)/[...slug]', { slug: target.slug })}>
						{target.title}
					</Breadcrumb.Link>
				</Breadcrumb.Item>
			{/if}
		{/each}
	</Breadcrumb.List>
</Breadcrumb.Root>
