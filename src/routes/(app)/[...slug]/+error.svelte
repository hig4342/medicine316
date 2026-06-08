<script lang="ts">
	import { resolve } from '$app/paths';
	import * as Empty from '$lib/components/ui/empty';
	import { m } from '$lib/paraglide/messages';
	import { Button } from '$lib/components/ui/button';
</script>

<Empty.Root class="h-full">
	<Empty.Header>
		<Empty.Title class="text-4xl">404</Empty.Title>
		<Empty.Title class="text-2xl">{m['404.heading']()}</Empty.Title>
		<Empty.Description>
			{m['404.subheading']()}
		</Empty.Description>
	</Empty.Header>
	<Empty.Content>
		<Button href={resolve('/(app)/[...slug]', { slug: '' })}>
			{m['404.backToHome']()}
		</Button>
	</Empty.Content>
</Empty.Root>
