import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { article, articleI18n } from '$lib/server/db/schema';
import { getDb } from '$lib/server/db';
import { formSchema, type Article } from './schema';

export const load = async ({ platform, url }) => {
	const form = await superValidate(valibot(formSchema));
	const articleId = url.searchParams.get('id');
	if (!platform) {
		return {
			form,
			articles: new Array<Article>()
		};
	}

	const db = getDb(platform.env.DB);

	const articles = await db
		.select()
		.from(article)
		.innerJoin(
			articleI18n,
			and(eq(article.id, articleI18n.articleId), eq(articleI18n.language, 'ko'))
		)
		.orderBy(article.priority, article.createdAt)
		.all()
		.then((rows) =>
			rows.map<Article>(({ article, article_i18n }) => ({
				id: article.id,
				slug: article.slug,
				priority: article.priority,
				status: article.status,
				language: article_i18n.language,
				title: article_i18n.title,
				summary: article_i18n.summary,
				readingTime: article.readingTime,
				content: article_i18n.content
			}))
		);

	if (articleId) {
		const selectedArticle = articles.find((a) => a.id === articleId);
		if (selectedArticle) {
			return {
				form: await superValidate(valibot(formSchema), {
					defaults: {
						id: selectedArticle.id,
						language: selectedArticle.language,
						status: selectedArticle.status,
						title: selectedArticle.title,
						summary: selectedArticle.summary,
						slug: selectedArticle.slug,
						readingTime: selectedArticle.readingTime,
						content: selectedArticle.content
					}
				}),
				articles
			};
		}
	}

	return {
		form,
		articles
	};
};

export const actions = {
	save: async ({ request, platform, cookies }) => {
		if (!platform) {
			return error(500, 'Platform not available');
		}

		const form = await superValidate(request, valibot(formSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { id, language, status, title, summary, slug, content, readingTime } = form.data;

		const db = getDb(platform.env.DB);

		const segments = slug.split('/');

		if (segments.length === 1) {
			await db
				.update(article)
				.set({ parentId: null, slug, status, readingTime })
				.where(eq(article.id, id));
		} else {
			const parentSlug = segments[segments.length - 2];
			const parentArticle = await db
				.select()
				.from(article)
				.where(and(eq(article.slug, parentSlug), eq(article.status, 'published')))
				.get();

			if (!parentArticle) {
				setFlash(
					{
						type: 'error',
						message: `상위 글이 존재하지 않거나 게시되지 않았습니다.: /${segments.slice(0, -1).join('/')}`
					},
					cookies
				);
				return fail(400, { form });
			}

			await db
				.update(article)
				.set({ parentId: parentArticle.id, slug, status, readingTime })
				.where(eq(article.id, id));
		}

		// Update articleI18n table (title, summary, content)
		await db
			.update(articleI18n)
			.set({ title, summary, content: typeof content === 'string' ? JSON.parse(content) : content })
			.where(and(eq(articleI18n.articleId, id), eq(articleI18n.language, language)));

		console.info(`Updated Article (ID: ${id}, Language: ${language})`);
		setFlash({ type: 'success', message: '글이 업데이트되었습니다.' }, cookies);
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
		await db.delete(article).where(eq(article.id, id));

		console.info(`Deleted Article (ID: ${id})`);
		setFlash({ type: 'success', message: '글이 삭제되었습니다.' }, cookies);

		return { form };
	}
};
