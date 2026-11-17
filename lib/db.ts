import { Pool } from "pg";
import { attachDatabasePool } from "@vercel/functions";

// node-postgres pool on the pooled DATABASE_URL. On Vercel (Fluid compute)
// attachDatabasePool lets idle clients close cleanly before the instance suspends.
// Schema lives in db/*.sql — run `npm run db:migrate`.

const DB_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const globalForPg = globalThis as unknown as { pgPool?: Pool };

export function pool(): Pool {
  if (!DB_URL) throw new Error("DATABASE_URL is not set");
  if (!/^postgres(ql)?:\/\//.test(DB_URL)) {
    throw new Error(
      'DATABASE_URL must start with "postgresql://" (no quotes, no "DATABASE_URL=" prefix, single line). Fix it in Vercel → Settings → Environment Variables and redeploy.',
    );
  }
  if (!globalForPg.pgPool) {
    globalForPg.pgPool = new Pool({ connectionString: DB_URL, max: 5, idleTimeoutMillis: 5_000 });
    attachDatabasePool(globalForPg.pgPool);
  }
  return globalForPg.pgPool;
}

/** Postgres unique-violation check. */
export const isUniqueViolation = (e: unknown) => (e as { code?: string })?.code === "23505";
