import type { ReferArticleOptions } from './types';

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		referArticle: {
			/**
			 * Insert a refer article
			 * @param options The refer article attributes
			 * @example editor.commands.setReferArticle({ articleId: '123' })
			 */
			setReferArticle: (options: ReferArticleOptions) => ReturnType;
		};
	}
}
