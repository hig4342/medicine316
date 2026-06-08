import * as v from 'valibot';
import type { Article as ArticleTable, ArticleI18n } from '$lib/server/db/schema';
import { locales } from '$lib/paraglide/runtime';
import { JSONContentSchema } from '$lib/types';

export const formSchema = v.object({
	id: v.string(),
	language: v.picklist(locales),
	status: v.picklist(['draft', 'published', 'archived'] as const),
	title: v.pipe(v.string(), v.nonEmpty('제목을 입력해주세요.')),
	summary: v.pipe(v.string(), v.nonEmpty('요약을 입력해주세요.')),
	readingTime: v.number(),
	slug: v.union([
		v.pipe(
			v.string(),
			v.regex(
				/^[a-zA-Z0-9\-/]+$/,
				'주소는 영문자, 숫자, 하이픈(-), 슬래시(/)만 사용할 수 있습니다.'
			)
		),
		v.literal('')
	]),
	content: v.nullable(JSONContentSchema)
});

export type ArticleFormData = v.InferInput<typeof formSchema>;

export type Article = Pick<ArticleTable, 'id' | 'priority' | 'slug' | 'status' | 'readingTime'> &
	Pick<ArticleI18n, 'language' | 'title' | 'summary' | 'content'>;
