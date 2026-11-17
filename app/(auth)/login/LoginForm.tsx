"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/app/account-actions";
import { Field, inputCls } from "../AuthCard";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);

  return (
    <form action={action} className="space-y-4 p-8">
      <Field label="Утасны дугаар">
        <input
          name="phone"
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          required
          defaultValue={state?.phone}
          placeholder="8800 0000"
          className={inputCls}
        />
      </Field>
      <Field label="Нууц үг">
        <input name="password" type="password" autoComplete="current-password" required className={inputCls} />
      </Field>
      {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-brand-900 py-3 text-[15px] font-bold text-white transition hover:bg-brand-800 disabled:opacity-60"
      >
        {pending ? "Шалгаж байна…" : "Нэвтрэх"}
      </button>
      <p className="text-center text-sm text-slate-500">
        Бүртгэлгүй юу?{" "}
        <Link href="/signup" className="font-semibold text-brand-600 hover:underline">
          Бүртгүүлэх
        </Link>
      </p>
    </form>
  );
}
