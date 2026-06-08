<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Editor } from '@tiptap/core';

	interface Props {
		editor: Editor;
	}

	let { editor, class: className, children }: Props & HTMLAttributes<HTMLDivElement> = $props();
</script>

{#if editor.isEditable}
	<div class={className}>
		{@render children?.()}
	</div>
{/if}
