import * as v from 'valibot';

export const signInSchema = v.object({
	username: v.string(),
	password: v.string()
});

export type SignInSchema = v.InferOutput<typeof signInSchema>;
