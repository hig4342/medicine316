<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import * as Accordion from '$lib/components/ui/accordion';
	import Answer from './answer.svelte';

	let { data } = $props();
	let faqs = $derived(data.faqs);
</script>

<div class="flex flex-col py-4">
	<h1 class="mb-4 text-center text-3xl font-bold">{m['faq.heading']()}</h1>
	<p class="mb-8 text-center text-lg text-muted-foreground">{m['faq.subheading']()}</p>
	<Accordion.Root type="multiple" class="space-y-4">
		{#each faqs as faq (faq.id)}
			<Accordion.Item value={faq.id} class="rounded-lg border">
				<Accordion.Trigger class="cursor-pointer p-4 text-xl font-bold">
					{faq.question}
				</Accordion.Trigger>
				<Accordion.Content class="border-t p-4">
					<Answer answer={faq.answer} />
				</Accordion.Content>
			</Accordion.Item>
		{/each}
	</Accordion.Root>
</div>
