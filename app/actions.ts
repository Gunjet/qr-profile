"use server";

// Admin server actions. (Self-service user actions live in app/account-actions.ts.)

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  closeRequest,
  confirmRequest,
  createPerson,
  deletePerson,
  extendSubscription,
  setPaidUntil,
  updatePerson,
} from "@/lib/store";
import { BILLING, EXTEND_OPTIONS } from "@/lib/billing";
import { parsePersonForm } from "@/lib/person-form";
import { SESSION_COOKIE, isValidSession } from "@/lib/auth";
import { endAdminSession } from "@/lib/admin-session";

// Server actions are reachable by direct POST requests, so every mutating
// action re-checks the admin session (proxy.ts only guards page navigation).
async function requireAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await isValidSession(token))) redirect("/login");
}

export async function adminLogout() {
  await endAdminSession();
  redirect("/login");
}

function revalidateProfile(id: string) {
  revalidatePath("/admin");
  revalidatePath(`/p/${id}`);
  revalidatePath("/account");
}

export async function savePerson(id: string | null, formData: FormData) {
  await requireAdmin();
  const input = parsePersonForm(formData);
  if (!input.name) throw new Error("Нэр оруулна уу");

  const personId = id ? (await updatePerson(id, input), id) : (await createPerson(input)).id;
  revalidateProfile(personId);
  redirect(`/admin/${personId}${id ? "?saved=1" : "?created=1"}`);
}

export async function removePerson(id: string) {
  await requireAdmin();
  await deletePerson(id);
  revalidatePath("/admin");
  redirect("/admin");
}

// ───────────── Billing ─────────────

export async function extendPaid(id: string, months: number) {
  await requireAdmin();
  if (!(EXTEND_OPTIONS as readonly number[]).includes(months)) throw new Error("Invalid months");
  await extendSubscription(id, months, months * BILLING.monthlyPrice);
  revalidateProfile(id);
  redirect(`/admin/${id}?paid=${months}`);
}

export async function changePaidUntil(id: string, formData: FormData) {
  await requireAdmin();
  const date = String(formData.get("paidUntil") ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Invalid date");
  // End of that day in Ulaanbaatar time.
  await setPaidUntil(id, new Date(`${date}T23:59:59+08:00`).toISOString());
  revalidateProfile(id);
  redirect(`/admin/${id}?dated=1`);
}

export async function confirmPaymentRequest(requestId: string) {
  await requireAdmin();
  const personId = await confirmRequest(requestId);
  if (personId) revalidateProfile(personId);
  revalidatePath("/admin");
}

export async function rejectPaymentRequest(requestId: string) {
  await requireAdmin();
  const personId = await closeRequest(requestId, "rejected");
  if (personId) revalidateProfile(personId);
  revalidatePath("/admin");
}
