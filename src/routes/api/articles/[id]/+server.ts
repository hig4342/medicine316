import { error, json } from '@sveltejs/kit';
import * as v from 'valibot';
import { and, eq } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import { article, articleI18n } from '$lib/server/db/schema';
import { locales } from '$lib/paraglide/runtime';

export const GET = async ({ platform, params, url }) => {
	if (!platform) {
		return error(500, 'Platform not available');
	}

	const { id } = params;
	const { output: language, success } = v.safeParse(
		v.picklist(locales),
		url.searchParams.get('language') || 'ko'
	);

	if (!success) {
		return error(400, 'Unsupported language');
	}

	const db = getDb(platform.env.DB);

	const result = await db.select().from(article).where(eq(article.id, id)).get();

	if (!result) {
		return error(404, 'Article not found');
	}

	const i18nResult = await db
		.select()
		.from(articleI18n)
		.where(and(eq(articleI18n.articleId, id), eq(articleI18n.language, language)))
		.get();

	if (!i18nResult) {
		const newI18nEntry = await db
			.insert(articleI18n)
			.values({
				articleId: id,
				language,
				title: '',
				summary: '',
				content: {}
			})
			.onConflictDoNothing()
			.returning()
			.get();

		return json({
			...result,
			language,
			title: newI18nEntry?.title ?? '',
			summary: newI18nEntry?.summary ?? '',
			slug: result.slug,
			content: newI18nEntry?.content ?? {}
		});
	}

	return json({
		...result,
		language: i18nResult.language,
		title: i18nResult.title,
		summary: i18nResult.summary,
		slug: result.slug,
		content: i18nResult.content
	});
};
