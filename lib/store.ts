import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { connection } from "next/server";
import { Pool } from "pg";
import { attachDatabasePool } from "@vercel/functions";
import type { Person } from "./types";
import { themeOf } from "./themes";

// Storage:
//  - DATABASE_URL (or POSTGRES_URL) set  → Postgres (Neon). Used on Vercel.
//  - otherwise                           → local JSON file in ./data (dev only).

export type PersonInput = Omit<Person, "id" | "createdAt" | "updatedAt">;

const DB_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;

const normalize = (p: Person): Person => ({ ...p, theme: themeOf(p.theme) });
const newId = () => randomBytes(5).toString("base64url");

// ───────────────────────── Postgres ─────────────────────────
// node-postgres pool on the pooled DATABASE_URL. On Vercel (Fluid compute)
// attachDatabasePool lets idle clients close cleanly before the instance suspends.
// Schema lives in db/*.sql — run `npm run db:migrate`.

const globalForPg = globalThis as unknown as { pgPool?: Pool };

function pool(): Pool {
  if (!DB_URL) throw new Error("DATABASE_URL is not set");
  if (!globalForPg.pgPool) {
    globalForPg.pgPool = new Pool({ connectionString: DB_URL, max: 5, idleTimeoutMillis: 5_000 });
    attachDatabasePool(globalForPg.pgPool);
  }
  return globalForPg.pgPool;
}

type Row = { id: string; data: PersonInput; created_at: Date; updated_at: Date };
const COLS = "id, data, created_at, updated_at";
const fromRow = (r: Row): Person =>
  normalize({
    ...r.data,
    id: r.id,
    createdAt: new Date(r.created_at).toISOString(),
    updatedAt: new Date(r.updated_at).toISOString(),
  });

const pg = {
  async list() {
    const { rows } = await pool().query<Row>(`SELECT ${COLS} FROM people ORDER BY created_at DESC`);
    return rows.map(fromRow);
  },
  async get(id: string) {
    const { rows } = await pool().query<Row>(`SELECT ${COLS} FROM people WHERE id = $1`, [id]);
    return rows[0] ? fromRow(rows[0]) : null;
  },
  async create(input: PersonInput) {
    const { rows } = await pool().query<Row>(
      `INSERT INTO people (id, data) VALUES ($1, $2::jsonb) RETURNING ${COLS}`,
      [newId(), JSON.stringify(input)],
    );
    return fromRow(rows[0]);
  },
  async update(id: string, input: PersonInput) {
    const { rows } = await pool().query<Row>(
      `UPDATE people SET data = $2::jsonb, updated_at = now() WHERE id = $1 RETURNING ${COLS}`,
      [id, JSON.stringify(input)],
    );
    return rows[0] ? fromRow(rows[0]) : null;
  },
  async remove(id: string) {
    await pool().query(`DELETE FROM people WHERE id = $1`, [id]);
  },
};

// ───────────────────────── JSON file (local dev) ─────────────────────────

const DATA_FILE = path.join(process.cwd(), "data", "people.json");

async function readAll(): Promise<Person[]> {
  try {
    return (JSON.parse(await fs.readFile(DATA_FILE, "utf8")) as Person[]).map(normalize);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeAll(people: Person[]) {
  if (process.env.VERCEL) {
    throw new Error("Vercel дээр DATABASE_URL тохируулаагүй байна. Neon Postgres холбоно уу.");
  }
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  const tmp = DATA_FILE + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(people, null, 2), "utf8");
  await fs.rename(tmp, DATA_FILE);
}

const file = {
  async list() {
    return (await readAll()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  async get(id: string) {
    return (await readAll()).find((p) => p.id === id) ?? null;
  },
  async create(input: PersonInput) {
    const people = await readAll();
    const now = new Date().toISOString();
    const person: Person = { ...input, id: newId(), createdAt: now, updatedAt: now };
    await writeAll([...people, person]);
    return person;
  },
  async update(id: string, input: PersonInput) {
    const people = await readAll();
    const idx = people.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    people[idx] = { ...people[idx], ...input, updatedAt: new Date().toISOString() };
    await writeAll(people);
    return people[idx];
  },
  async remove(id: string) {
    await writeAll((await readAll()).filter((p) => p.id !== id));
  },
};

const backend = DB_URL ? pg : file;

// ───────────────────────── Public API ─────────────────────────

export async function listPeople(): Promise<Person[]> {
  await connection();
  return backend.list();
}

export async function getPerson(id: string): Promise<Person | null> {
  await connection();
  return backend.get(id);
}

export const createPerson = (input: PersonInput) => backend.create(input);
export const updatePerson = (id: string, input: PersonInput) => backend.update(id, input);
export const deletePerson = (id: string) => backend.remove(id);
