<script lang="ts">
	import { Editor } from 'svelte-tiptap';
	import { toast } from 'svelte-sonner';
	import { m } from '$lib/paraglide/messages';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Copy from '@lucide/svelte/icons/copy';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';

	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();

	async function copyHtml() {
		const html = editor.getHTML();
		await navigator.clipboard.writeText(html);
		toast.success(m['extensions.copyPage.copyHtmlSuccess']());
	}

	async function copyMarkdown() {
		const markdown = editor.getMarkdown();
		await navigator.clipboard.writeText(markdown);
		toast.success(m['extensions.copyPage.copyMarkdownSuccess']());
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class={buttonVariants({ variant: 'outline', class: 'group cursor-pointer' })}
	>
		<Copy />
		{m['extensions.copyPage.label']()}
		<ChevronDown class="transition group-data-[state=open]:rotate-180" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item onclick={copyMarkdown}>마크다운 복사</DropdownMenu.Item>
		<DropdownMenu.Item onclick={copyHtml}>HTML 복사</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
