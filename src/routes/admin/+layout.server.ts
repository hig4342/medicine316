import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.session && url.pathname !== '/admin/sign-in') {
		throw redirect(302, '/admin/sign-in');
	}

	if (locals.session && url.pathname === '/admin/sign-in') {
		throw redirect(302, '/admin');
	}
};
