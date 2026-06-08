<script lang="ts">
	import { onMount } from 'svelte';
	import type { Readable } from 'svelte/store';
	import { Content, createEditor, type Editor } from '$lib/components/tiptap';
	import type { JSONContent } from '@tiptap/core';
	import {
		StarterKit,
		CharacterCount,
		TaskItem,
		TaskList,
		TextAlign,
		Placeholder
	} from '$lib/components/tiptap/extensions';

	let { answer }: { answer: JSONContent | null } = $props();

	let editor = $state<Readable<Editor>>();

	onMount(() => {
		editor = createEditor({
			extensions: [
				StarterKit,
				TextAlign.configure({ types: ['heading', 'paragraph'] }),
				CharacterCount,
				Placeholder.configure({ placeholder: '답변 내용을 입력하세요...' }),
				TaskList,
				TaskItem
			],
			content: answer,
			editable: false
		});
	});
</script>

{#if $editor}
	<Content editor={$editor} />
{/if}
