// Usage: npm run make-admin -- someone@example.com   (the user must have signed up first)
import "./env";
import { eq } from "drizzle-orm";
import { db } from "../src/db";
import { user } from "../src/db/schema";

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) throw new Error("Usage: npm run make-admin -- someone@example.com");
  const [row] = await db.update(user).set({ role: "admin" }).where(eq(user.email, email)).returning({ id: user.id, name: user.name });
  if (!row) throw new Error(`No user with email ${email}. Sign up on the site first, then run this again.`);
  console.log(`${row.name} <${email}> is now an admin. Open /admin (log out and in again if already signed in).`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  });
