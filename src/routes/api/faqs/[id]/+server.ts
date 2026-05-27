import { error, json } from '@sveltejs/kit';
import * as v from 'valibot';
import { and, eq } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import { faq, faqI18n } from '$lib/server/db/schema';
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

	const result = await db.select().from(faq).where(eq(faq.id, id)).get();

	if (!result) {
		return error(404, 'FAQ not found');
	}

	const i18nResult = await db
		.select()
		.from(faqI18n)
		.where(and(eq(faqI18n.faqId, id), eq(faqI18n.language, language)))
		.get();

	if (!i18nResult) {
		const newI18nEntry = await db
			.insert(faqI18n)
			.values({
				faqId: id,
				language,
				question: '',
				answer: ''
			})
			.onConflictDoNothing()
			.returning()
			.get();

		return json({
			...result,
			language,
			question: newI18nEntry?.question || '',
			answer: newI18nEntry?.answer || ''
		});
	}

	return json({
		...result,
		language,
		question: i18nResult?.question || '',
		answer: i18nResult?.answer || ''
	});
};
