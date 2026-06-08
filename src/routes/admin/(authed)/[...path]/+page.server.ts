import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import { article, articleI18n } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ params, platform }) => {
	const { path } = params;

	if (path !== '') {
		redirect(302, '/admin');
	}

	if (!platform) {
		return {
			allArticleCount: 0,
			publishedArticleCount: 0,
			draftArticleCount: 0,
			latestArticles: []
		};
	}

	const db = getDb(platform.env.DB);

	const allArticleCount = await db.$count(article);
	const publishedArticleCount = await db.$count(article, eq(article.status, 'published'));
	const draftArticleCount = await db.$count(article, eq(article.status, 'draft'));
	const rows = await db
		.select()
		.from(article)
		.innerJoin(
			articleI18n,
			and(eq(article.id, articleI18n.articleId), eq(articleI18n.language, 'ko'))
		)
		.orderBy(article.createdAt)
		.limit(5);

	const latestArticles = rows.map(({ article, article_i18n }) => ({
		id: article.id,
		title: article_i18n.title,
		status: statusName(article.status),
		createdAt: article.createdAt
	}));

	return {
		allArticleCount,
		publishedArticleCount,
		draftArticleCount,
		latestArticles
	};
};

function statusName(status: 'draft' | 'published' | 'archived') {
	switch (status) {
		case 'published':
			return '게시됨';
		case 'draft':
			return '임시 저장됨';
		case 'archived':
			return '보관됨';
	}
}
