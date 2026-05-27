<script lang="ts">
	import Header from '$lib/components/header.svelte';

	let { children } = $props();
</script>

<Header />
<div class="container mx-auto mt-4">
	<main>
		{@render children()}
	</main>
</div>
