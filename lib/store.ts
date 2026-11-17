import { randomBytes } from "node:crypto";
import { connection } from "next/server";
import type { Payment, PaymentRequest, Person } from "./types";
import { themeOf } from "./themes";
import { BILLING } from "./billing";
import { pool } from "./db";

// All data lives in Postgres (Neon). Schema: db/*.sql

export type PersonInput = Omit<Person, "id" | "createdAt" | "updatedAt" | "paidUntil" | "ownerId" | "ownerPhone">;

const newId = () => randomBytes(5).toString("base64url");

type Row = {
  id: string;
  data: PersonInput;
  paid_until: Date | null;
  owner_id: string | null;
  owner_phone?: string | null;
  created_at: Date;
  updated_at: Date;
};
const COLS = "p.id, p.data, p.paid_until, p.owner_id, p.created_at, p.updated_at";
const iso = (d: Date) => new Date(d).toISOString();
const fromRow = (r: Row): Person => ({
  ...r.data,
  theme: themeOf(r.data.theme),
  id: r.id,
  paidUntil: r.paid_until ? iso(r.paid_until) : null,
  ownerId: r.owner_id,
  ownerPhone: r.owner_phone ?? null,
  createdAt: iso(r.created_at),
  updatedAt: iso(r.updated_at),
});

// ───────────── People ─────────────

export async function listPeople(): Promise<Person[]> {
  await connection();
  const { rows } = await pool().query<Row>(
    `SELECT ${COLS}, u.phone AS owner_phone
       FROM people p LEFT JOIN users u ON u.id = p.owner_id
      ORDER BY p.created_at DESC`,
  );
  return rows.map(fromRow);
}

export async function getPerson(id: string): Promise<Person | null> {
  await connection();
  const { rows } = await pool().query<Row>(
    `SELECT ${COLS}, u.phone AS owner_phone
       FROM people p LEFT JOIN users u ON u.id = p.owner_id WHERE p.id = $1`,
    [id],
  );
  return rows[0] ? fromRow(rows[0]) : null;
}

export async function getPersonByOwner(userId: string): Promise<Person | null> {
  await connection();
  const { rows } = await pool().query<Row>(`SELECT ${COLS} FROM people p WHERE p.owner_id = $1`, [userId]);
  return rows[0] ? fromRow(rows[0]) : null;
}

/**
 * Admin-created profiles start with a free trial. Self-service profiles start
 * unpaid (paid_until NULL) and go live once their first payment is confirmed.
 */
export async function createPerson(input: PersonInput, opts: { ownerId?: string } = {}) {
  const trialDays = opts.ownerId ? null : BILLING.trialDays;
  const { rows } = await pool().query<Row>(
    `INSERT INTO people AS p (id, data, owner_id, paid_until)
     VALUES ($1, $2::jsonb, $3, CASE WHEN $4::int IS NULL THEN NULL ELSE now() + make_interval(days => $4::int) END)
     RETURNING ${COLS}`,
    [newId(), JSON.stringify(input), opts.ownerId ?? null, trialDays],
  );
  return fromRow(rows[0]);
}

export async function updatePerson(id: string, input: PersonInput) {
  const { rows } = await pool().query<Row>(
    `UPDATE people AS p SET data = $2::jsonb, updated_at = now() WHERE p.id = $1 RETURNING ${COLS}`,
    [id, JSON.stringify(input)],
  );
  return rows[0] ? fromRow(rows[0]) : null;
}

export async function deletePerson(id: string) {
  await pool().query(`DELETE FROM people WHERE id = $1`, [id]);
}

// ───────────── Subscription ─────────────

export async function extendSubscription(id: string, months: number, amount: number) {
  // One atomic statement: push paid_until forward and record the payment.
  const { rows } = await pool().query<{ paid_until: Date }>(
    `WITH u AS (
       UPDATE people
          SET paid_until = GREATEST(COALESCE(paid_until, now()), now()) + make_interval(months => $2)
        WHERE id = $1
        RETURNING id, paid_until
     )
     INSERT INTO payments (person_id, months, amount, paid_until)
     SELECT id, $2, $3, paid_until FROM u
     RETURNING paid_until`,
    [id, months, amount],
  );
  return rows[0] ? iso(rows[0].paid_until) : null;
}

export async function setPaidUntil(id: string, isoDate: string) {
  await pool().query(`UPDATE people SET paid_until = $2 WHERE id = $1`, [id, isoDate]);
}

type PayRow = { id: string; person_id: string; months: number; amount: number; paid_until: Date; created_at: Date };

export async function listPayments(id: string): Promise<Payment[]> {
  await connection();
  const { rows } = await pool().query<PayRow>(
    `SELECT id, person_id, months, amount, paid_until, created_at
       FROM payments WHERE person_id = $1 ORDER BY created_at DESC LIMIT 20`,
    [id],
  );
  return rows.map((r) => ({
    id: String(r.id),
    personId: r.person_id,
    months: r.months,
    amount: r.amount,
    paidUntil: iso(r.paid_until),
    createdAt: iso(r.created_at),
  }));
}

// ───────────── Payment requests (user says "I transferred", admin confirms) ─────────────

type ReqRow = {
  id: string;
  person_id: string;
  person_name: string;
  owner_phone: string | null;
  months: number;
  amount: number;
  status: PaymentRequest["status"];
  created_at: Date;
};
const REQ_SELECT = `
  SELECT r.id, r.person_id, p.data->>'name' AS person_name, u.phone AS owner_phone,
         r.months, r.amount, r.status, r.created_at
    FROM payment_requests r
    JOIN people p ON p.id = r.person_id
    LEFT JOIN users u ON u.id = p.owner_id`;
const fromReq = (r: ReqRow): PaymentRequest => ({
  id: String(r.id),
  personId: r.person_id,
  personName: r.person_name,
  ownerPhone: r.owner_phone,
  months: r.months,
  amount: r.amount,
  status: r.status,
  createdAt: iso(r.created_at),
});

/** Returns false if a request is already pending for this profile. */
export async function createPaymentRequest(personId: string, months: number, amount: number) {
  const { rowCount } = await pool().query(
    `INSERT INTO payment_requests (person_id, months, amount) VALUES ($1, $2, $3)
     ON CONFLICT (person_id) WHERE status = 'pending' DO NOTHING`,
    [personId, months, amount],
  );
  return rowCount === 1;
}

export async function getPendingRequest(personId: string): Promise<PaymentRequest | null> {
  await connection();
  const { rows } = await pool().query<ReqRow>(`${REQ_SELECT} WHERE r.person_id = $1 AND r.status = 'pending'`, [
    personId,
  ]);
  return rows[0] ? fromReq(rows[0]) : null;
}

export async function listPendingRequests(): Promise<PaymentRequest[]> {
  await connection();
  const { rows } = await pool().query<ReqRow>(`${REQ_SELECT} WHERE r.status = 'pending' ORDER BY r.created_at`);
  return rows.map(fromReq);
}

/** Confirms a pending request, extends the subscription and records the payment — atomically. */
export async function confirmRequest(requestId: string) {
  const { rows } = await pool().query<{ person_id: string }>(
    `WITH r AS (
       UPDATE payment_requests SET status = 'confirmed', decided_at = now()
        WHERE id = $1 AND status = 'pending'
        RETURNING person_id, months, amount
     ), u AS (
       UPDATE people p
          SET paid_until = GREATEST(COALESCE(p.paid_until, now()), now()) + make_interval(months => r.months)
         FROM r WHERE p.id = r.person_id
        RETURNING p.id, p.paid_until, r.months, r.amount
     )
     INSERT INTO payments (person_id, months, amount, paid_until)
     SELECT id, months, amount, paid_until FROM u
     RETURNING person_id`,
    [requestId],
  );
  return rows[0]?.person_id ?? null;
}

export async function closeRequest(requestId: string, status: "rejected" | "cancelled", personId?: string) {
  const { rows } = await pool().query<{ person_id: string }>(
    `UPDATE payment_requests SET status = $2, decided_at = now()
      WHERE id = $1 AND status = 'pending' AND ($3::text IS NULL OR person_id = $3)
      RETURNING person_id`,
    [requestId, status, personId ?? null],
  );
  return rows[0]?.person_id ?? null;
}
