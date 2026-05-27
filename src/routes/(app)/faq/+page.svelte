<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';

	let { data } = $props();
	let faqs = $derived(data.faqs);
</script>

<div class="flex flex-col gap-4 py-4">
	<h1 class="mb-4 text-center text-2xl font-bold">자주 묻는 질문</h1>
	<Accordion.Root type="multiple" class="space-y-4">
		{#each faqs as faq (faq.id)}
			<Accordion.Item value={faq.id} class="rounded-lg border">
				<Accordion.Trigger class="p-4">{faq.question}</Accordion.Trigger>
				<Accordion.Content class="border-t p-4">{faq.answer}</Accordion.Content>
			</Accordion.Item>
		{/each}
	</Accordion.Root>
</div>
