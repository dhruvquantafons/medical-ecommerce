import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// The app uses Neon's pooled endpoint when available (PgBouncer in transaction mode, so
// prepared statements must be off). Migrations use the direct DATABASE_URL (see drizzle.config.ts).
const url = process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.");

// Reuse one connection pool across hot reloads in development.
const globalForDb = globalThis as unknown as { pg?: postgres.Sql };
const client = globalForDb.pg ?? postgres(url, { prepare: false, max: 10 });
if (process.env.NODE_ENV !== "production") globalForDb.pg = client;

export const db = drizzle(client, { schema });
export type DB = typeof db;
