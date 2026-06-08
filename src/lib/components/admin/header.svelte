<script lang="ts">
	import { resolve } from '$app/paths';
	import ThemeSwitcher from '$lib/components/theme-switcher.svelte';
	import { Button } from '$lib/components/ui/button';
	import House from '@lucide/svelte/icons/house';
</script>

<header class="z-50 h-16 w-full border-b bg-background">
	<div class="container mx-auto flex h-full items-center">
		<a href={resolve('/admin/(authed)')}>
			<h1>Admin Dashboard</h1>
		</a>
		<nav class="flex h-full flex-1 items-center justify-center space-x-4">
			<a href={resolve('/admin/(authed)/articles')}>게시글</a>
			<a href={resolve('/admin/(authed)/faq')}>FAQ</a>
		</nav>
		<div class="flex items-center gap-2">
			<ThemeSwitcher />
			<Button href={resolve('/(app)/[...slug]', { slug: '' })} variant="outline" size="icon">
				<House />
			</Button>
		</div>
	</div>
</header>
