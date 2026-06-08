<script lang="ts">
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages';
	import type { NodeViewProps } from '@tiptap/core';
	import { NodeViewWrapper } from 'svelte-tiptap';
	import { page } from '$app/state';
	import * as Item from '$lib/components/ui/item';
	import { Button } from '$lib/components/ui/button';
	import FileSymlink from '@lucide/svelte/icons/file-symlink';
	import FileX from '@lucide/svelte/icons/file-x';

	let { node }: NodeViewProps = $props();

	const articles = $derived(page.data.articles);
	const article = $derived(articles.find((article) => article.id === node.attrs.articleId));
</script>

<NodeViewWrapper class="mt-8">
	<Item.Root variant="outline">
		{#if article}
			<Item.Media variant="icon">
				<FileSymlink />
			</Item.Media>
			<Item.Content>
				{#if article}
					<Item.Title>{article.title}</Item.Title>
					<Item.Description>{article.summary}</Item.Description>
				{/if}
			</Item.Content>
			<Item.Actions>
				<Button class="cursor-pointer" href={resolve('/(app)/[...slug]', { slug: article.slug })}
					>{m['extensions.referArticle.show']()}</Button
				>
			</Item.Actions>
		{:else}
			<Item.Media variant="icon">
				<FileX />
			</Item.Media>
			<Item.Content>
				<Item.Title>존재하지 않는 게시글</Item.Title>
			</Item.Content>
		{/if}
	</Item.Root>
</NodeViewWrapper>
