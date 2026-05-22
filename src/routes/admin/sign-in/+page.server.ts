import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { signInSchema } from './schema';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(valibot(signInSchema))
	};
};

export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, valibot(signInSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { username, password } = form.data;

		try {
			await locals.auth.api.signInUsername({
				body: {
					username,
					password
				}
			});
		} catch {
			return setError(form, 'password', 'Invalid username or password');
		}

		return {
			form
		};
	}
};
