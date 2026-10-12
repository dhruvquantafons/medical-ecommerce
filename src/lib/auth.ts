import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { site } from "@/config/site";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { adminPlugin } from "./auth-plugins";
import { sendEmail } from "./mail";
import { getPasswordResetEmail } from "./email-templates";

export const auth = betterAuth({
  appName: site.name,
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
    sendResetPassword: async ({ user, url }) => {
      console.info(`[auth] Password reset link for ${user.email}: ${url}`);
      await sendEmail({
        to: user.email,
        subject: `Reset your ${site.name} password`,
        html: getPasswordResetEmail({ url, userEmail: user.email }),
      });
    },
  },
  // nextCookies must stay last so cookies set in server actions reach the browser.
  plugins: [adminPlugin(), nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
