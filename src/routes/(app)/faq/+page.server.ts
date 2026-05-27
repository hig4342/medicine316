import type { PageServerLoad } from './$types';
import { and, eq } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import { faq, faqI18n } from '$lib/server/db/schema';
import { getLocale } from '$lib/paraglide/runtime';

export const load: PageServerLoad = async ({ platform }) => {
	if (!platform) {
		return {
			faqs: []
		};
	}

	const currentLocale = getLocale();
	const db = getDb(platform.env.DB);

	const faqs = await db
		.select()
		.from(faq)
		.innerJoin(faqI18n, and(eq(faq.id, faqI18n.faqId), eq(faqI18n.language, currentLocale)))
		.orderBy(faq.priority, faq.createdAt)
		.all()
		.then((rows) =>
			rows.map(({ faq, faq_i18n }) => ({
				...faq,
				question: faq_i18n.question,
				answer: faq_i18n.answer
			}))
		);

	return {
		faqs
	};
};
