<script lang="ts">
	import { pushState } from '$app/navigation';
	import type { Editor } from '$lib/components/tiptap';
	import { TextSelection } from '@tiptap/pm/state';
	import type { TableOfContentData } from '$lib/components/tiptap/extensions';
	import { cn } from '$lib/utils';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	interface Props {
		editor: Editor;
		items: TableOfContentData;
	}

	const { editor, items }: Props = $props();

	function scrollToHeading(event: MouseEvent, id: string) {
		event.preventDefault();

		const element = editor.view.dom.querySelector(`[data-toc-id="${id}"`);
		if (element) {
			const pos = editor.view.posAtDOM(element, 0);
			// set focus
			const tr = editor.view.state.tr;
			tr.setSelection(new TextSelection(tr.doc.resolve(pos)));
			editor.view.dispatch(tr);
			editor.view.focus();

			pushState(resolve(`/(app)/[...slug]#${id}`, { slug: page.params.slug ?? '' }), {});
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}
</script>

<div class="space-y-2">
	<p class="font-bold">On This Page</p>
	<ul class="pl-1">
		{#each items as item (item.id)}
			<li style:--level={item.level} data-active={item.isActive} class="group">
				<a
					class={cn(
						'block w-full cursor-pointer space-y-1 border-l bg-background py-1 text-start text-sm text-muted-foreground',
						'hover:border-primary hover:bg-accent hover:text-primary',
						'group-data-active:border-primary group-data-active:bg-accent group-data-active:font-bold group-data-active:text-primary!',
						'pl-[calc(var(--level)*(--spacing(3)))]'
					)}
					href={`#${item.id}`}
					onclick={(e) => scrollToHeading(e, item.id)}
				>
					{item.textContent}
				</a>
			</li>
		{/each}
	</ul>
</div>
