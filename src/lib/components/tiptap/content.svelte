<script lang="ts">
	import { page } from '$app/state';
	import { EditorContent, type Editor } from 'svelte-tiptap';
	import type { LocalizedArticle } from '$lib/types';
	import { Toolbar } from './toolbar';
	import * as Commands from './toolbar/commands';
	import { Separator } from '$lib/components/ui/separator';
	import * as InputGroup from '$lib/components/ui/input-group';

	interface Props {
		editor: Editor;
		articles?: Pick<LocalizedArticle, 'id' | 'title'>[];
	}

	let { editor, articles = page.data.articles }: Props = $props();
</script>

{#if editor.isEditable}
	<div class="relative block h-full w-full">
		<InputGroup.Root class="relative block h-full w-full">
			<InputGroup.Addon class="w-full border-b">
				<Toolbar {editor} class="flex h-9 w-full flex-row items-center justify-start gap-2">
					<div class="flex flex-row">
						<Commands.Undo {editor} />
						<Commands.Redo {editor} />
					</div>
					<Separator orientation="vertical" />
					<div class="flex flex-row">
						<Commands.Formats {editor} />
						<Commands.Bold {editor} />
						<Commands.Italic {editor} />
						<Commands.Strike {editor} />
						<Commands.Underline {editor} />
						<Commands.Code {editor} />
					</div>
					<Separator orientation="vertical" />
					<div class="flex flex-row">
						<Commands.Alignments {editor} />
						<Commands.Blockquote {editor} />
						<Commands.Image {editor} />
						<Commands.Youtube {editor} />
						<Commands.ReferArticle {editor} {articles} />
					</div>
				</Toolbar>
			</InputGroup.Addon>
			<InputGroup.Addon class="w-full text-black">
				<EditorContent class="w-full" {editor} />
			</InputGroup.Addon>
		</InputGroup.Root>
	</div>
{:else}
	<EditorContent class="w-full" {editor} />
{/if}

<style lang="postcss">
	@reference '#layout.css';

	:global(.ProseMirror) {
		@apply focus:outline-none;

		/* Paragraph styles */
		> :global(p) {
			@apply leading-7 not-first:mt-6;
		}

		/* Heading styles */
		> :global(h1) {
			@apply mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight not-first:mt-4 lg:text-5xl;
		}
		> :global(h2) {
			@apply mb-4 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors not-first:mt-4;
		}
		> :global(h3) {
			@apply scroll-m-20 text-2xl font-semibold tracking-tight not-first:mt-4;
		}

		> :global(code) {
			@apply relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold;
		}

		> :global(blockquote) {
			@apply border-s-2 ps-6 italic not-first:mt-4;
		}

		> :global(ul) {
			@apply my-4 ms-6 list-disc [&>li]:mt-2;
		}

		> :global(ol) {
			@apply my-4 ms-6 list-decimal [&>li]:mt-2;
		}
	}
</style>
