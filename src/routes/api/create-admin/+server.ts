import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { APIError } from 'better-auth';

export const POST = async ({ locals }) => {
	const { auth } = locals;

	try {
		await auth.api.signUpEmail({
			body: {
				email: 'hwangingyu@platformoz.com',
				password: env.INITIAL_ADMIN_PASSWORD,
				name: 'admin',
				username: 'admin',
				displayUsername: 'admin'
			}
		});
	} catch (err) {
		if (err instanceof APIError) {
			return error(500, 'Already exists create admin');
		} else {
			console.error('Unexpected error creating admin:', err);
			return error(500, 'An unexpected error occurred while creating admin');
		}
	}

	return json({ message: 'Admin user created successfully' });
};
