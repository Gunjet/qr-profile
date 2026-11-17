"use client";

import { useActionState } from "react";
import { login } from "@/app/actions";

export function LoginForm() {
  const [error, action, pending] = useActionState(login, null);

  return (
    <form action={action} className="space-y-4 p-8">
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-slate-600">Нууц үг</span>
        <input
          type="password"
          name="password"
          required
          autoFocus
          autoComplete="current-password"
          className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-[15px] outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
        />
      </label>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-brand-900 py-3 text-[15px] font-bold text-white transition hover:bg-brand-800 disabled:opacity-60"
      >
        {pending ? "Шалгаж байна…" : "Нэвтрэх"}
      </button>
    </form>
  );
}
