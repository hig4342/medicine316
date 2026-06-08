import * as v from 'valibot';
import type { JSONContent } from '@tiptap/core';

export const JSONContentSchema: v.GenericSchema<JSONContent> = v.object({
	type: v.optional(v.string()),
	attrs: v.optional(v.record(v.string(), v.unknown())),
	content: v.optional(v.array(v.lazy(() => JSONContentSchema))),
	marks: v.optional(
		v.array(
			v.object({
				type: v.string(),
				attrs: v.optional(v.record(v.string(), v.unknown()))
			})
		)
	),
	text: v.optional(v.string())
});

export interface LocalizedArticle {
	id: string;
	parentId: string | null;
	slug: string;
	priority: number;
	status: 'draft' | 'published' | 'archived';
	title: string;
	summary: string;
	content: JSONContent | null;
	createdAt: Date;
	updatedAt: Date;
	publishedAt: Date | null;
}

export interface ArticleWithChildren extends LocalizedArticle {
	children: ArticleWithChildren[];
}
