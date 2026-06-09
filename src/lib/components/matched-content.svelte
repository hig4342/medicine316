<script lang="ts">
	import hansearch from 'hangul-search';
	import type { JSONContent } from '@tiptap/core';
	import type { LocalizedArticle } from '$lib/types';

	interface Props {
		article: LocalizedArticle;
		query: string;
	}

	interface HighlightSegment {
		text: string;
		matched: boolean;
	}

	interface HangulSearchMarkedResult {
		items: Array<{
			value?: string;
		}>;
	}

	const highlightTag = 'strong';
	const highlightRegex = new RegExp(`<${highlightTag}>(.*?)</${highlightTag}>`, 'g');

	function extractPlainText(content: JSONContent | null | undefined): string {
		if (!content) return '';

		const text = [content.text ?? '', ...(content.content?.map(extractPlainText) ?? [])]
			.join(' ')
			.replace(/\s+/g, ' ')
			.trim();

		return text;
	}

	function toHighlightedSegments(text: string, searchTerm: string): HighlightSegment[] {
		if (!text) return [];
		if (!searchTerm.trim()) return [{ text, matched: false }];

		try {
			const marked = (
				hansearch([{ value: text }], searchTerm, ['value']).mark(
					highlightTag
				) as unknown as HangulSearchMarkedResult
			).items[0]?.value;

			if (typeof marked !== 'string' || marked === text) {
				return [{ text, matched: false }];
			}

			const segments: HighlightSegment[] = [];
			let lastIndex = 0;

			for (const match of marked.matchAll(highlightRegex)) {
				const start = match.index ?? -1;
				if (start < 0) continue;

				if (start > lastIndex) {
					segments.push({ text: marked.slice(lastIndex, start), matched: false });
				}

				segments.push({ text: match[1], matched: true });
				lastIndex = start + match[0].length;
			}

			if (lastIndex < marked.length) {
				segments.push({ text: marked.slice(lastIndex), matched: false });
			}

			return segments.filter((segment) => segment.text.length > 0);
		} catch (e) {
			console.error(e);
			return [{ text, matched: false }];
		}
	}

	let { article, query }: Props = $props();
	const plainText = $derived(extractPlainText(article.content));

	const highlightedTitle = $derived(toHighlightedSegments(article.title, query));
	const highlightedContent = $derived(toHighlightedSegments(plainText, query));
</script>

<h1>
	{#each highlightedTitle as segment, index (`title-${index}-${segment.matched}`)}
		{#if segment.matched}
			<strong>{segment.text}</strong>
		{:else}
			{segment.text}
		{/if}
	{/each}
</h1>
<p class="line-clamp-3 text-sm text-muted-foreground">
	{#each highlightedContent as segment, index (`content-${index}-${segment.matched}`)}
		{#if segment.matched}
			<strong>{segment.text}</strong>
		{:else}
			{segment.text}
		{/if}
	{/each}
</p>
