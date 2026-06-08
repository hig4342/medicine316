<script lang="ts">
	import { AdminHeader } from '$lib/components/admin';
	let { children } = $props();
</script>

<AdminHeader />
<main class="h-[calc(100svh-(--spacing(16)))]">
	{@render children()}
</main>
