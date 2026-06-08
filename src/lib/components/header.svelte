<script lang="ts">
	import { resolve } from '$app/paths';
	import { cn } from '$lib/utils';
	import type { LocalizedArticle } from '$lib/types';
	import { goto } from '$app/navigation';
	import Search from './search.svelte';
	import ThemeSwitcher from './theme-switcher.svelte';
	import I18nSwitcher from './i18n-switcher.svelte';
	import ShieldUser from '@lucide/svelte/icons/shield-user';
	import { Button } from '$lib/components/ui/button';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import Menu from '@lucide/svelte/icons/menu';
	import X from '@lucide/svelte/icons/x';
	import ArticleTree from './article-tree.svelte';
	import { Separator } from './ui/separator';

	interface Props {
		hasSession: boolean;
		articles: LocalizedArticle[];
	}

	let { hasSession, articles }: Props = $props();

	const isMd = new IsMobile();
	const isLg = new IsMobile(1024);
	let open = $state(false);
</script>

<header class="fixed top-0 z-10 w-full bg-background backdrop-blur lg:bg-background/90">
	<div class="w-full border-b">
		<div class="mx-auto flex h-16 items-center justify-between px-4 lg:container lg:px-0">
			<div class="flex items-center">
				<a href={resolve('/(app)')}>Medicine316</a>
			</div>
			<div class="flex flex-1 items-center justify-end space-x-2">
				<nav class="flex items-center space-x-4 px-2">
					<a href={resolve('/(app)/faq')}>FAQ</a>
				</nav>
				{#if isMd.current}
					<button
						class="group relative flex cursor-pointer items-center justify-center p-0.5"
						data-open={open}
						onclick={() => (open = !open)}
					>
						<Menu
							class="size-4.5 opacity-100 transition-opacity duration-200 group-data-open:opacity-0"
						/>
						<X
							class="absolute size-4.5 opacity-0 transition-opacity duration-200 group-data-open:opacity-100"
						/>
					</button>
				{:else}
					{#if !isLg.current}
						<div class="w-64">
							<Search {articles} />
						</div>
					{/if}
					<ThemeSwitcher />
					<I18nSwitcher />
					{#if hasSession}
						<Button
							href={resolve('/admin/(authed)/[...path]', { path: '' })}
							variant="outline"
							size="icon"
						>
							<ShieldUser />
						</Button>
					{/if}
				{/if}
			</div>
		</div>
	</div>
	{#if isMd.current}
		<div
			class={cn('overflow-hidden transition-[height]', {
				'h-[calc(100dvh-(--spacing(16)))]': open,
				'h-0': !open
			})}
		>
			<div class="flex h-[calc(100dvh-(--spacing(16)))] flex-col gap-2 p-4">
				<Search {articles} onclick={() => (open = false)} />
				<ScrollArea class="flex-1">
					<ArticleTree
						{articles}
						onSelect={async (event, article) => {
							event.preventDefault();
							await goto(resolve('/(app)/[...slug]', { slug: article.slug }));
							open = false;
						}}
					/>
				</ScrollArea>
				<Separator />
				<div class="flex items-center justify-between">
					<I18nSwitcher />
					<ThemeSwitcher />
				</div>
			</div>
		</div>
	{/if}
</header>
