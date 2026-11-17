"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { requestPayment } from "@/app/account-actions";

const fmt = (n: number) => `₮${n.toLocaleString("en-US")}`;

export function PlanPicker({ options, monthlyPrice }: { options: readonly number[]; monthlyPrice: number }) {
  const [months, setMonths] = useState(options[0]);

  return (
    <form action={requestPayment} className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.map((m) => (
          <label key={m} className="cursor-pointer">
            <input
              type="radio"
              name="months"
              value={m}
              checked={months === m}
              onChange={() => setMonths(m)}
              className="peer sr-only"
            />
            <span className="block rounded-xl border-2 border-slate-200 px-3 py-2.5 transition peer-checked:border-brand-600 peer-checked:bg-brand-50 peer-focus-visible:ring-4 peer-focus-visible:ring-brand-500/20">
              <span className="block text-sm font-bold text-slate-900">{m} сар</span>
              <span className="block text-xs text-slate-500">{fmt(m * monthlyPrice)}</span>
            </span>
          </label>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
        <span className="text-sm text-slate-600">Шилжүүлэх дүн</span>
        <span className="text-xl font-extrabold text-slate-900">{fmt(months * monthlyPrice)}</span>
      </div>

      <Submit />
      <p className="text-center text-xs text-slate-400">
        Дансанд шилжүүлсний дараа энэ товчийг дарна уу. Админ шалгаад баталгаажуулна.
      </p>
    </form>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-emerald-600 py-3.5 text-[15px] font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
    >
      {pending ? "Илгээж байна…" : "Шилжүүлсэн — баталгаажуулах"}
    </button>
  );
}
