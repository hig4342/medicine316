<script lang="ts">
	import './layout.css';
	import { page } from '$app/state';
	import { getFlash } from 'sveltekit-flash-message';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	const flash = getFlash(page);

	flash.subscribe((flash) => {
		if (flash) {
			const { type = 'default', message } = flash;

			if (type === 'default') {
				toast(message);
			} else {
				toast[type](message);
			}
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
<Toaster position="top-center" />
{@render children()}
