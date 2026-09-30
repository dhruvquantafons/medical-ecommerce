import { admin } from "better-auth/plugins";

/**
 * Plugins that add database tables/columns are created here and used by BOTH the real auth config
 * (src/lib/auth.ts) and the schema generator (scripts/auth-schema.config.ts). If you add another
 * schema-changing plugin, add it to both files, then run `npm run auth:generate` and `npm run db:generate`.
 */
export const adminPlugin = () => admin();
