import { relations, sql } from 'drizzle-orm';
import {
	sqliteTable,
	text,
	integer,
	primaryKey,
	index,
	real,
	type AnySQLiteColumn
} from 'drizzle-orm/sqlite-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-valibot';
import * as v from 'valibot';
import { locales } from '$lib/paraglide/runtime';

export const article = sqliteTable(
	'article',
	{
		id: text('id').primaryKey(),
		slug: text('slug').notNull(),
		priority: real('priority').default(0.0).notNull(),
		parentId: text('parent_id').references((): AnySQLiteColumn => article.id, {
			onDelete: 'set null'
		}),
		readingTime: integer('reading_time').default(0).notNull(),
		status: text('status', { enum: ['draft', 'published', 'archived'] })
			.default('draft')
			.notNull(),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		publishedAt: integer('published_at', { mode: 'timestamp_ms' })
	},
	(table) => [index('article_slug_idx').on(table.slug)]
);

export const articleI18n = sqliteTable(
	'article_i18n',
	{
		articleId: text('article_id')
			.notNull()
			.references(() => article.id, { onDelete: 'cascade' }),
		language: text('language', { enum: locales }).default('ko').notNull(),
		title: text('title').notNull(),
		summary: text('summary').default('').notNull(),
		content: text('content', { mode: 'json' })
			.default('{}')
			.notNull()
			.$type<Record<string, unknown>>()
	},
	(table) => [
		primaryKey({ columns: [table.articleId, table.language] }),
		index('article_i18n_language_idx').on(table.language)
	]
);

export const articleRelations = relations(article, ({ one, many }) => ({
	parent: one(article, {
		fields: [article.parentId],
		references: [article.id]
	}),
	i18n: many(articleI18n),
	children: many(article)
}));

export const articleSelectSchema = createSelectSchema(article);
export const articleI18nSelectSchema = createSelectSchema(articleI18n);

export type Article = v.InferOutput<typeof articleSelectSchema>;
export type ArticleI18n = v.InferOutput<typeof articleI18nSelectSchema>;

export const articleInsertSchema = createInsertSchema(article);
export const articleI18nInsertSchema = createInsertSchema(articleI18n);

export type ArticleInsertSchema = v.InferInput<typeof articleInsertSchema>;
export type ArticleI18nInsertSchema = v.InferInput<typeof articleI18nInsertSchema>;
