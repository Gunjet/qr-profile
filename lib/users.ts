import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { pool } from "./db";

export type User = { id: string; phone: string; name: string; createdAt: string };

export { USER_COOKIE } from "./user-cookie";
import { USER_COOKIE } from "./user-cookie";
const SESSION_DAYS = 30;

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
const newId = () => randomBytes(8).toString("base64url");

/** Mongolian mobile numbers: 8 digits. Spaces / dashes / +976 are stripped. */
export function normalizePhone(input: string) {
  const digits = input.replace(/\D/g, "").replace(/^976(?=\d{8}$)/, "");
  return /^\d{8}$/.test(digits) ? digits : null;
}

type UserRow = { id: string; phone: string; name: string; created_at: Date };
const fromRow = (r: UserRow): User => ({
  id: r.id,
  phone: r.phone,
  name: r.name,
  createdAt: new Date(r.created_at).toISOString(),
});

/** Returns null if the phone is already registered. */
export async function createUser(phone: string, name: string, passwordHash: string) {
  const { rows } = await pool().query<UserRow>(
    `INSERT INTO users (id, phone, name, password_hash) VALUES ($1, $2, $3, $4)
     ON CONFLICT (phone) DO NOTHING
     RETURNING id, phone, name, created_at`,
    [newId(), phone, name, passwordHash],
  );
  return rows[0] ? fromRow(rows[0]) : null;
}

export async function getUserForLogin(phone: string) {
  const { rows } = await pool().query<UserRow & { password_hash: string }>(
    `SELECT id, phone, name, created_at, password_hash FROM users WHERE phone = $1`,
    [phone],
  );
  return rows[0] ? { user: fromRow(rows[0]), passwordHash: rows[0].password_hash } : null;
}

export async function setUserPassword(userId: string, passwordHash: string) {
  await pool().query(`UPDATE users SET password_hash = $2 WHERE id = $1`, [userId, passwordHash]);
  await pool().query(`DELETE FROM sessions WHERE user_id = $1`, [userId]); // log out everywhere
}

// ───────────── Sessions (cookie holds a random token; DB stores its hash) ─────────────

export async function startSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await pool().query(`INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, $3)`, [
    sha256(token),
    userId,
    expires,
  ]);
  (await cookies()).set(USER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function endSession() {
  const store = await cookies();
  const token = store.get(USER_COOKIE)?.value;
  if (token) await pool().query(`DELETE FROM sessions WHERE token_hash = $1`, [sha256(token)]);
  store.delete(USER_COOKIE);
}

/** The logged-in user, or null. Reads cookies, so call it inside a Suspense boundary. */
export async function currentUser(): Promise<User | null> {
  await connection(); // request-time only: the DB driver reads the clock
  const token = (await cookies()).get(USER_COOKIE)?.value;
  if (!token) return null;
  const { rows } = await pool().query<UserRow>(
    `SELECT u.id, u.phone, u.name, u.created_at
       FROM sessions s JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = $1 AND s.expires_at > now()`,
    [sha256(token)],
  );
  return rows[0] ? fromRow(rows[0]) : null;
}
