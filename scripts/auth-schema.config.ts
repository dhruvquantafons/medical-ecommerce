// Used only by `npm run auth:generate` to (re)generate src/db/auth-schema.ts.
// It needs no database connection; it only describes which tables Better Auth requires.
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { adminPlugin } from "../src/lib/auth-plugins";

export const auth = betterAuth({
  database: drizzleAdapter({} as never, { provider: "pg" }),
  emailAndPassword: { enabled: true },
  plugins: [adminPlugin()],
});
