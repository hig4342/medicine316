import type { User, Session } from 'better-auth';
import type { LocalizedArticle } from '$lib/types';
import { createAuth } from '$lib/server/auth';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Platform {
			env: Env;
			ctx: ExecutionContext;
			caches: CacheStorage;
			cf?: IncomingRequestCfProperties;
		}

		interface Locals {
			user?: User;
			session?: Session;
			auth: ReturnType<typeof createAuth>;
		}

		// interface Error {}
		interface PageData {
			flash?: {
				type?: 'default' | 'info' | 'success' | 'warning' | 'error';
				message: string;
			};
			articles: LocalizedArticle[];
		}
		// interface PageState {}
	}
}

export {};
