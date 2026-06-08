import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { faq, faqI18n } from '$lib/server/db/schema';
import { getDb } from '$lib/server/db';
import { formSchema, type FAQ } from './schema';

export const load = async ({ platform }) => {
	const form = await superValidate(valibot(formSchema));

	if (!platform) {
		return {
			form,
			faqs: new Array<FAQ>()
		};
	}

	const db = getDb(platform.env.DB);

	const faqs = await db
		.select()
		.from(faq)
		.innerJoin(faqI18n, and(eq(faq.id, faqI18n.faqId), eq(faqI18n.language, 'ko')))
		.orderBy(faq.priority, faq.createdAt)
		.all()
		.then((rows) =>
			rows.map<FAQ>(({ faq, faq_i18n }) => ({
				...faq,
				language: faq_i18n.language,
				question: faq_i18n.question,
				answer: faq_i18n.answer
			}))
		);

	return {
		form,
		faqs
	};
};

export const actions = {
	save: async ({ request, platform, cookies }) => {
		if (!platform) {
			return error(500, 'Platform not available');
		}

		const form = await superValidate(request, valibot(formSchema));

		if (!form.valid) {
			console.error('Form validation failed:', form.errors);
			return fail(400, { form });
		}

		console.log('Form data:', form.data);

		const { id, language, question, answer } = form.data;

		const db = getDb(platform.env.DB);

		await db
			.update(faqI18n)
			.set({ question, answer })
			.where(and(eq(faqI18n.faqId, id), eq(faqI18n.language, language)));

		console.log(`Updated FAQ (ID: ${id}, Language: ${language})`);
		setFlash({ type: 'success', message: 'FAQ가 업데이트되었습니다.' }, cookies);
		return { form };
	},
	delete: async ({ request, platform, cookies }) => {
		if (!platform) {
			return error(500, 'Platform not available');
		}

		const form = await superValidate(request, valibot(formSchema));

		if (!form.valid) {
			return fail(400, { form });
		}
		const { id } = form.data;

		const db = getDb(platform.env.DB);
		await db.delete(faq).where(eq(faq.id, id));

		console.log(`Deleted FAQ (ID: ${id})`);
		setFlash({ type: 'success', message: 'FAQ가 삭제되었습니다.' }, cookies);

		return { form };
	}
};
