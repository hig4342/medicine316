import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import { article, articleI18n } from '$lib/server/db/schema';
import { getLocale } from '$lib/paraglide/runtime';
import type { LocalizedArticle } from '$lib/types';

export const load: PageServerLoad = async ({ platform, params }) => {
	if (!platform) {
		return;
	}

	const currentLocale = getLocale();
	const db = getDb(platform.env.DB);

	const result = await db
		.select()
		.from(article)
		.innerJoin(
			articleI18n,
			and(eq(article.id, articleI18n.articleId), eq(articleI18n.language, currentLocale))
		)
		.where(and(eq(article.slug, params.slug ?? ''), eq(article.status, 'published')))
		.orderBy(article.priority, article.createdAt)
		.get();

	if (!result) {
		throw error(404, 'Article not found');
	}

	const articleData: LocalizedArticle = {
		id: result.article.id,
		parentId: result.article.parentId,
		slug: result.article.slug,
		priority: result.article.priority,
		status: result.article.status,
		title: result.article_i18n.title,
		summary: result.article_i18n.summary,
		content: result.article_i18n.content,
		createdAt: result.article.createdAt,
		updatedAt: result.article.updatedAt,
		publishedAt: result.article.publishedAt
	};

	return {
		article: articleData
	};
};
