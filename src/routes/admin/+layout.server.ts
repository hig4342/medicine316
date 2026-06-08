import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const { session } = locals;

	if (!session && url.pathname !== '/admin/sign-in') {
		throw redirect(302, '/admin/sign-in');
	}

	if (session && url.pathname === '/admin/sign-in') {
		throw redirect(302, '/admin');
	}
};
