import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, primaryKey, index, real } from 'drizzle-orm/sqlite-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-valibot';
import * as v from 'valibot';
import { locales } from '$lib/paraglide/runtime';
import type { JSONContent } from '@tiptap/core';

export const faq = sqliteTable('faq', {
	id: text('id').primaryKey(),
	priority: real('priority').default(0.0).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull()
});

export const faqI18n = sqliteTable(
	'faq_i18n',
	{
		faqId: text('faq_id')
			.notNull()
			.references(() => faq.id, { onDelete: 'cascade' }),
		language: text('language', { enum: locales }).notNull().default('ko'),
		question: text('question').notNull().default(''),
		answer: text('content', { mode: 'json' }).$type<JSONContent>()
	},
	(table) => [
		primaryKey({ columns: [table.faqId, table.language] }),
		index('faq_i18n_language_idx').on(table.language)
	]
);

export const faqSelectSchema = createSelectSchema(faq);
export const faqI18nSelectSchema = createSelectSchema(faqI18n);

export type Faq = v.InferOutput<typeof faqSelectSchema>;
export type FaqI18n = v.InferOutput<typeof faqI18nSelectSchema>;

export const faqInsertSchema = createInsertSchema(faq);
export const faqI18nInsertSchema = createInsertSchema(faqI18n);

export type FaqInsertSchema = v.InferInput<typeof faqInsertSchema>;
export type FaqI18nInsertSchema = v.InferInput<typeof faqI18nInsertSchema>;
