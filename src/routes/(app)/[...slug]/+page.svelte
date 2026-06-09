<script lang="ts">
	import { onMount } from 'svelte';
	import type { Readable } from 'svelte/store';
	import { Tween } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import { BitsConfig } from 'bits-ui';
	import { m } from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { MetaTags } from 'svelte-meta-tags';
	import { Content, createEditor, Editor } from '$lib/components/tiptap';
	import type { LocalizedArticle } from '$lib/types';
	import {
		CharacterCount,
		getHierarchicalIndexes,
		Placeholder,
		StarterKit,
		TableOfContents,
		TaskItem,
		TaskList,
		TextAlign,
		type TableOfContentData,
		TOC,
		CopyPage,
		Image,
		Markdown,
		Youtube,
		ReferArticle
	} from '$lib/components/tiptap/extensions';
	import Breadcrumb from '$lib/components/breadcrumb.svelte';
	import ArticleTree from '$lib/components/article-tree.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { page } from '$app/state';

	const { data } = $props();

	const locale = getLocale();

	let article = $state<LocalizedArticle>();
	const articles = $derived(data.articles);

	let editor = $state<Readable<Editor>>();
	let items = $state<TableOfContentData>([]);
	let scrollY = $state(0);
	const tweenedScrollY = Tween.of(() => scrollY, { delay: 75, duration: 200, easing: cubicInOut });

	onMount(() => {
		editor = createEditor({
			editable: false,
			extensions: [
				Markdown,
				StarterKit,
				CharacterCount,
				Placeholder.configure({
					placeholder: '게시글 본문을 입력하세요...'
				}),
				TaskList,
				TaskItem,
				TextAlign.configure({
					types: ['heading', 'paragraph']
				}),
				TableOfContents.configure({
					getIndex: getHierarchicalIndexes,
					onUpdate(data) {
						items = data;
					}
				}),
				Image,
				Youtube.configure({
					ccLanguage: locale
				}),
				ReferArticle
			]
		});
	});

	$effect.pre(() => {
		if (!$editor) return;
		if (!data.article) return;
		if (article?.id === data.article.id) return;

		article = data.article;
		$editor.commands.setContent(article.content);
	});
</script>

<svelte:window bind:scrollY />

<MetaTags
	title={`${article?.title} - Medicine316`}
	description={article?.summary}
	openGraph={{
		title: `${article?.title} - Medicine316`,
		description: article?.summary,
		url: `${page.url}/${article?.slug}`,
		type: 'article',
		article: {
			publishedTime: article?.publishedAt?.toTemporalInstant().toString(),
			modifiedTime: article?.updatedAt?.toTemporalInstant().toString()
		}
	}}
	twitter={{ title: `${article?.title} - Medicine316`, description: article?.summary }}
/>

<div class="grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-6 lg:pt-4 xl:gap-8">
	<div class="order-1 col-span-1 hidden px-2 md:block">
		<ArticleTree {articles} />
	</div>
	<BitsConfig>
		<div class="order-3 col-span-1 px-4 md:col-span-3 lg:order-2">
			{#if article}
				<Breadcrumb {articles} {article} />
			{/if}
			{#if $editor}
				<div class="flex items-center justify-end py-2">
					<CopyPage editor={$editor} />
				</div>
				<Content editor={$editor} />
			{/if}
			<Separator class="my-8" />
			{#if article}
				<div>
					<p>
						{m['articles.lastUpdated']({
							updatedAt: article.updatedAt
								.toTemporalInstant()
								.toZonedDateTimeISO('Asia/Seoul')
								.toLocaleString(Intl.DateTimeFormat().resolvedOptions().locale, {
									dateStyle: 'long',
									timeStyle: 'short'
								})
						})}
					</p>
				</div>
			{/if}
			<Separator class="my-8" />
		</div>
	</BitsConfig>
	<div class="order-2 hidden px-2 lg:order-3 lg:block">
		{#if $editor && items.length > 0}
			<div
				style:--tweenY={tweenedScrollY.current}
				class="lg:translate-y-[calc(var(--tweenY)*1px)] lg:transform-gpu"
			>
				<TOC editor={$editor} {items} />
			</div>
		{/if}
	</div>
</div>
