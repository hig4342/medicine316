import type { User, Session } from 'better-auth';
import { createAuth } from '$lib/server/auth';
import { type Article, type ArticleI18n } from '$lib/server/db/schema';

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
			hasSession: boolean;
			articles?: Array<
				Pick<Article, 'id' | 'slug' | 'priority' | 'parentId' | 'status' | 'createdAt'> &
					Pick<ArticleI18n, 'title'>
			>;
		}
		// interface PageState {}
	}
}

export {};
