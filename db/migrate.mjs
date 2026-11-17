// Applies db/*.sql in order, once each. Uses the DIRECT (unpooled) connection.
// Usage: npm run db:migrate   (reads .env.local)
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL_UNPOOLED / DATABASE_URL is not set");
  process.exit(1);
}

const dir = path.dirname(new URL(import.meta.url).pathname);
const client = new pg.Client({ connectionString: url });
await client.connect();
try {
  await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`);
  const done = new Set((await client.query("SELECT name FROM schema_migrations")).rows.map((r) => r.name));
  const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();
  for (const f of files) {
    if (done.has(f)) {
      console.log(`skip    ${f}`);
      continue;
    }
    await client.query("BEGIN");
    await client.query(await readFile(path.join(dir, f), "utf8"));
    await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [f]);
    await client.query("COMMIT");
    console.log(`applied ${f}`);
  }
} catch (e) {
  await client.query("ROLLBACK").catch(() => {});
  throw e;
} finally {
  await client.end();
}
