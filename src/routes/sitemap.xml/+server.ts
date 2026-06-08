import { eq } from 'drizzle-orm';
import { getLocale } from '$lib/paraglide/runtime';
import { getDb } from '$lib/server/db';
import { article, articleI18n } from '$lib/server/db/schema';
import type { LocalizedArticle } from '$lib/types';

export const GET = async ({ platform }) => {
	if (!platform) {
		return new Response(generateSitemap([]), {
			headers: {
				'Content-Type': 'application/xml'
			}
		});
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

	return new Response(generateSitemap(articles), {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};

const generateSitemap = (articles: LocalizedArticle[] = []) => {
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://medicine316.com/</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>https://medicine316.com/faq</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>0.8</priority>
    </url>
    ${articles
			.map(
				(article) => `
      <url>
        <loc>https://medicine316.com/${article.slug}</loc>
        <lastmod>${new Date(article.updatedAt).toISOString()}</lastmod>
      </url>
    `
			)
			.join('')}
  </urlset>`;

	return sitemap;
};
