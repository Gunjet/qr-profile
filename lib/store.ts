import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { connection } from "next/server";
import type { Person } from "./types";
import { themeOf } from "./themes";

// Simple JSON-file storage for the first (design) phase.
// Swap this module for a real database later; the rest of the app only
// talks to these functions.
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "people.json");

async function readAll(): Promise<Person[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return (JSON.parse(raw) as Person[]).map((p) => ({ ...p, theme: themeOf(p.theme) }));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeAll(people: Person[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = DATA_FILE + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(people, null, 2), "utf8");
  await fs.rename(tmp, DATA_FILE);
}

export async function listPeople(): Promise<Person[]> {
  await connection();
  const people = await readAll();
  return people.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getPerson(id: string): Promise<Person | null> {
  await connection();
  const people = await readAll();
  return people.find((p) => p.id === id) ?? null;
}

export type PersonInput = Omit<Person, "id" | "createdAt" | "updatedAt">;

export async function createPerson(input: PersonInput): Promise<Person> {
  const people = await readAll();
  const now = new Date().toISOString();
  let id = randomBytes(5).toString("base64url");
  while (people.some((p) => p.id === id)) id = randomBytes(5).toString("base64url");
  const person: Person = { ...input, id, createdAt: now, updatedAt: now };
  people.push(person);
  await writeAll(people);
  return person;
}

export async function updatePerson(id: string, input: PersonInput): Promise<Person | null> {
  const people = await readAll();
  const idx = people.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  people[idx] = { ...people[idx], ...input, updatedAt: new Date().toISOString() };
  await writeAll(people);
  return people[idx];
}

export async function deletePerson(id: string) {
  const people = await readAll();
  await writeAll(people.filter((p) => p.id !== id));
}
