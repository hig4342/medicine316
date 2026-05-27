<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import Search from './search.svelte';
	import { Button } from './ui/button';
	import ThemeSwitcher from './theme-switcher.svelte';
	import I18nSwitcher from './i18n-switcher.svelte';
	import ShieldUser from '@lucide/svelte/icons/shield-user';
</script>

<header class="h-16 border-b">
	<div class="container mx-auto flex h-full items-center justify-between">
		<div class="flex items-center">
			<a href={resolve('/(app)')}>Medicine316</a>
		</div>
		<div class="flex items-center space-x-2">
			<nav class="flex items-center space-x-4 p-4">
				<a href={resolve('/(app)/faq')}>FAQ</a>
			</nav>
			<div class="w-64">
				<Search />
			</div>
			<ThemeSwitcher />
			<I18nSwitcher />
			{#if page.data.hasSession}
				<Button href={resolve('/admin')} variant="outline" size="icon">
					<ShieldUser />
				</Button>
			{/if}
		</div>
	</div>
</header>
