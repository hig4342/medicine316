import { loadFlash } from 'sveltekit-flash-message/server';
import { eq } from 'drizzle-orm';
import { getLocale } from '$lib/paraglide/runtime';
import { getDb } from '$lib/server/db';
import { article, articleI18n } from '$lib/server/db/schema';
import type { LocalizedArticle } from '$lib/types';

export const load = loadFlash(async ({ platform }) => {
	if (!platform) {
		return {
			articles: []
		};
	}

	const currentLocale = getLocale();
	const db = getDb(platform.env.DB);

	const localizedArticle = db
		.select()
		.from(articleI18n)
		.where(eq(articleI18n.language, currentLocale))
		.as('localized_article');

	const articles: LocalizedArticle[] = await db
		.select({
			id: article.id,
			parentId: article.parentId,
			slug: article.slug,
			priority: article.priority,
			status: article.status,
			title: localizedArticle.title,
			summary: localizedArticle.summary,
			content: localizedArticle.content,
			createdAt: article.createdAt,
			updatedAt: article.updatedAt,
			publishedAt: article.publishedAt
		})
		.from(article)
		.innerJoin(localizedArticle, eq(localizedArticle.articleId, article.id))
		.where(eq(article.status, 'published'))
		.orderBy(article.priority, article.createdAt)
		.all();

	return {
		articles
	};
});
