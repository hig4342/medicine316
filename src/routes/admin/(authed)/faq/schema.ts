import * as v from 'valibot';
import type { Faq, FaqI18n } from '$lib/server/db/schema';
import { locales } from '$lib/paraglide/runtime';
import { JSONContentSchema } from '$lib/types';

export const formSchema = v.object({
	id: v.string(),
	language: v.picklist(locales),
	question: v.pipe(v.string(), v.nonEmpty('질문을 입력해주세요.')),
	answer: v.nullable(JSONContentSchema)
});

export type FaqFormData = v.InferInput<typeof formSchema>;

export type FAQ = Pick<Faq, 'id' | 'priority'> & Pick<FaqI18n, 'language' | 'question' | 'answer'>;
