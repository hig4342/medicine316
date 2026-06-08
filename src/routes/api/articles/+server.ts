import { error, json } from '@sveltejs/kit';
import { faker } from '@faker-js/faker';
import { getDb } from '$lib/server/db';
import {
	article,
	articleI18n,
	type ArticleI18nInsertSchema,
	type ArticleInsertSchema
} from '$lib/server/db/schema';

export const POST = async ({ platform }) => {
	if (!platform) {
		return error(500, 'Platform not available');
	}

	const db = getDb(platform.env.DB);

	const newArticle: ArticleInsertSchema = {
		id: crypto.randomUUID(),
		slug: faker.lorem.slug(3)
	};

	const newKoreanArticle: ArticleI18nInsertSchema = {
		articleId: newArticle.id,
		language: 'ko',
		title: '새 글'
	};

	try {
		const articleResult = await db.insert(article).values(newArticle).returning().get();
		const articleI18nResult = await db
			.insert(articleI18n)
			.values(newKoreanArticle)
			.returning()
			.get();

		const result = {
			...articleResult,
			language: articleI18nResult.language,
			title: articleI18nResult.title,
			summary: articleI18nResult.summary,
			content: articleI18nResult.content
		};

		console.log(`Inserted new Article (ID: ${newArticle.id})`);
		return json(result);
	} catch (err) {
		console.error('Error inserting article:', err);
		return error(500, 'Failed to create article');
	}
};
