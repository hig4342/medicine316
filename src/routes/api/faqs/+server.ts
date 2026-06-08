import { error, json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import {
	faq,
	faqI18n,
	type FaqI18nInsertSchema,
	type FaqInsertSchema
} from '$lib/server/db/schema';

export const POST = async ({ platform }) => {
	if (!platform) {
		return error(500, 'Platform not available');
	}

	const db = getDb(platform.env.DB);

	const newFaq: FaqInsertSchema = {
		id: crypto.randomUUID(),
		priority: 0
	};

	const newKoreanFaq: FaqI18nInsertSchema = {
		faqId: newFaq.id,
		language: 'ko',
		question: '새 질문'
	};

	try {
		const faqResult = await db.insert(faq).values(newFaq).returning().get();
		const faqI18nResult = await db.insert(faqI18n).values(newKoreanFaq).returning().get();

		const result = {
			...faqResult,
			language: faqI18nResult.language,
			question: faqI18nResult.question,
			answer: faqI18nResult.answer
		};

		console.log(`Inserted new FAQ (ID: ${newFaq.id})`);
		return json(result);
	} catch (err) {
		console.error('Error inserting faq:', err);
		return error(500, 'Failed to create faq');
	}
};
