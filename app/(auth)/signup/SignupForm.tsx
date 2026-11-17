"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup } from "@/app/account-actions";
import { Field, inputCls } from "../AuthCard";

export function SignupForm() {
  const [state, action, pending] = useActionState(signup, null);

  return (
    <form action={action} className="space-y-4 p-8">
      <Field label="Нэр">
        <input name="name" required autoComplete="name" defaultValue={state?.name} placeholder="Бат" className={inputCls} />
      </Field>
      <Field label="Утасны дугаар">
        <input
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          required
          defaultValue={state?.phone}
          placeholder="8800 0000"
          className={inputCls}
        />
      </Field>
      <Field label="Нууц үг (6+ тэмдэгт)">
        <input name="password" type="password" autoComplete="new-password" minLength={6} required className={inputCls} />
      </Field>
      {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-brand-900 py-3 text-[15px] font-bold text-white transition hover:bg-brand-800 disabled:opacity-60"
      >
        {pending ? "Үүсгэж байна…" : "Бүртгүүлэх"}
      </button>
      <p className="text-center text-sm text-slate-500">
        Бүртгэлтэй юу?{" "}
        <Link href="/login" className="font-semibold text-brand-600 hover:underline">
          Нэвтрэх
        </Link>
      </p>
    </form>
  );
}
