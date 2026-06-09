import { Node, mergeAttributes } from '@tiptap/core';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';

import ReferArticleComponent from './refer-article.svelte';
import type { ReferArticleOptions } from './types';

export const ReferArticle = Node.create<ReferArticleOptions>({
	name: 'referArticle',
	group: 'block',
	atom: true,
	draggable: true, // Optional: to make the node draggable
	inline: false,

	addAttributes() {
		return {
			articleId: ''
		};
	},

	addCommands() {
		return {
			setReferArticle:
				(options) =>
				({ commands }) => {
					return commands.insertContent({
						type: this.name,
						attrs: options
					});
				}
		};
	},

	parseHTML() {
		return [{ tag: 'refer-article-component' }];
	},

	renderHTML({ HTMLAttributes }) {
		return ['refer-article-component', mergeAttributes(HTMLAttributes)];
	},

	renderText() {
		return '';
	},

	addNodeView() {
		return SvelteNodeViewRenderer(ReferArticleComponent);
	}
});
