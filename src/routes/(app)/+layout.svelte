<script lang="ts">
	import Header from '$lib/components/header.svelte';

	let { data, children } = $props();

	const hasSession = $derived(data.hasSession);
	const articles = $derived(data.articles);
</script>

<Header {hasSession} {articles} />
<div class="mx-auto h-[calc(100dvh-(--spacing(16)))] lg:container">
	<main class="mt-16 h-full pt-4">
		{@render children()}
	</main>
</div>
