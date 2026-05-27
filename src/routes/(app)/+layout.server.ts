import type { LayoutServerLoad } from './$types';
import { and, eq } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import { article, articleI18n } from '$lib/server/db/schema';
import { getLocale } from '$lib/paraglide/runtime';

export const load: LayoutServerLoad = async ({ locals, platform }) => {
	if (!platform) {
		return {
			hasSession: false,
			articles: []
		};
	}

	const { session } = locals;

	const currentLocale = getLocale();
	const db = getDb(platform.env.DB);

	const rows = await db
		.select()
		.from(article)
		.where(eq(article.status, 'published'))
		.innerJoin(
			articleI18n,
			and(eq(articleI18n.articleId, article.id), eq(articleI18n.language, currentLocale))
		);
	const articles = rows.map(({ article, article_i18n: i18n }) => ({
		id: article.id,
		slug: article.slug,
		priority: article.priority,
		parentId: article.parentId,
		status: article.status,
		createdAt: article.createdAt,
		title: i18n.title
	}));

	return {
		hasSession: !!session,
		articles
	};
};
