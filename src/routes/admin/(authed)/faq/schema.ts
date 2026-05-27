import * as v from 'valibot';
import type { Faq, FaqI18n } from '$lib/server/db/schema';
import { locales } from '$lib/paraglide/runtime';

export const formSchema = v.object({
	id: v.string(),
	language: v.picklist(locales),
	question: v.pipe(v.string(), v.nonEmpty('질문을 입력해주세요.')),
	answer: v.pipe(v.string(), v.nonEmpty('답변을 입력해주세요.'))
});

export type FaqFormData = v.InferInput<typeof formSchema>;

export type FAQ = Pick<Faq, 'id' | 'priority'> & Pick<FaqI18n, 'language' | 'question' | 'answer'>;
