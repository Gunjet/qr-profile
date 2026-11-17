"use server";

// Self-service account actions. Each re-checks the session: server actions are
// public POST endpoints.

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { BILLING, EXTEND_OPTIONS } from "@/lib/billing";
import { DUMMY_HASH, hashPassword, verifyPassword } from "@/lib/password";
import { parsePersonForm } from "@/lib/person-form";
import {
  closeRequest,
  createPaymentRequest,
  createPerson,
  getPersonByOwner,
  updatePerson,
} from "@/lib/store";
import { createUser, currentUser, endSession, getUserForLogin, normalizePhone, startSession } from "@/lib/users";

export type FormState = { error?: string; phone?: string; name?: string } | null;

const slow = () => new Promise((r) => setTimeout(r, 500));

async function requireUser() {
  const user = await currentUser();
  if (!user) redirect("/login");
  return user;
}

export async function signup(_prev: FormState, fd: FormData): Promise<FormState> {
  const name = String(fd.get("name") ?? "").trim().slice(0, 80);
  const rawPhone = String(fd.get("phone") ?? "");
  const password = String(fd.get("password") ?? "");
  const keep = { phone: rawPhone, name };

  const phone = normalizePhone(rawPhone);
  if (!name) return { ...keep, error: "Нэрээ оруулна уу" };
  if (!phone) return { ...keep, error: "Утасны дугаар 8 оронтой байх ёстой" };
  if (password.length < 6) return { ...keep, error: "Нууц үг хамгийн багадаа 6 тэмдэгт байна" };
  if (password.length > 200) return { ...keep, error: "Нууц үг хэт урт байна" };

  const user = await createUser(phone, name, await hashPassword(password));
  if (!user) return { ...keep, error: "Энэ дугаараар бүртгэл аль хэдийн үүссэн байна. Нэвтэрнэ үү." };

  await startSession(user.id);
  redirect("/account");
}

export async function login(_prev: FormState, fd: FormData): Promise<FormState> {
  const rawPhone = String(fd.get("phone") ?? "");
  const password = String(fd.get("password") ?? "");
  const phone = normalizePhone(rawPhone);

  const found = phone ? await getUserForLogin(phone) : null;
  // Always run one hash check so timing doesn't reveal whether the phone exists.
  const ok = await verifyPassword(password, found?.passwordHash ?? DUMMY_HASH);
  if (!found || !ok) {
    await slow();
    return { phone: rawPhone, error: "Утасны дугаар эсвэл нууц үг буруу байна" };
  }

  await startSession(found.user.id);
  redirect("/account");
}

export async function logout() {
  await endSession();
  redirect("/login");
}

export async function saveMyProfile(fd: FormData) {
  const user = await requireUser();
  const input = parsePersonForm(fd);
  if (!input.name) throw new Error("Нэр оруулна уу");

  const existing = await getPersonByOwner(user.id);
  const person = existing ? await updatePerson(existing.id, input) : await createPerson(input, { ownerId: user.id });

  revalidatePath("/account");
  revalidatePath("/admin");
  if (person) revalidatePath(`/p/${person.id}`);
  redirect(existing ? "/account?saved=1" : "/account?created=1");
}

export async function requestPayment(fd: FormData) {
  const months = Number(fd.get("months"));
  const user = await requireUser();
  if (!(EXTEND_OPTIONS as readonly number[]).includes(months)) throw new Error("Invalid months");
  const person = await getPersonByOwner(user.id);
  if (!person) redirect("/account/profile");

  await createPaymentRequest(person.id, months, months * BILLING.monthlyPrice);
  revalidatePath("/account");
  revalidatePath("/admin");
  redirect("/account?requested=1");
}

export async function cancelPaymentRequest(requestId: string) {
  const user = await requireUser();
  const person = await getPersonByOwner(user.id);
  if (person) await closeRequest(requestId, "cancelled", person.id);
  revalidatePath("/account");
  revalidatePath("/admin");
  redirect("/account");
}
