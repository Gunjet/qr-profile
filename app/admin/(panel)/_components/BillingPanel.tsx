import { ArrowUpRightIcon } from "@/lib/icons";
import { changePaidUntil, extendPaid } from "@/app/actions";
import { BILLING, EXTEND_OPTIONS, formatDate, formatMNT, refCode, toDateInput } from "@/lib/billing";
import type { Payment, Person } from "@/lib/types";
import { CopyButton } from "@/app/_components/CopyButton";
import { StatusBadge } from "@/app/_components/StatusBadge";

export function BillingPanel({ person, payments, now }: { person: Person; payments: Payment[]; now: Date }) {
  const ref = refCode(person.id);

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-bold text-slate-900">Төлбөр</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Дуусах: <span className="font-semibold text-slate-700">{formatDate(person.paidUntil)}</span>
          </p>
        </div>
        <StatusBadge paidUntil={person.paidUntil} now={now} />
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 py-1.5 pr-1.5 pl-3">
        <span className="min-w-0 flex-1 text-xs text-slate-500">
          Гүйлгээний утга: <span className="font-mono font-bold text-slate-800">{ref}</span>
        </span>
        <CopyButton value={ref} />
      </div>

      <p className="mt-4 mb-2 text-xs font-semibold text-slate-600">Төлбөр баталгаажуулах</p>
      <div className="grid grid-cols-2 gap-2">
        {EXTEND_OPTIONS.map((m) => (
          <form key={m} action={extendPaid.bind(null, person.id, m)}>
            <button
              type="submit"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              <span className="block text-sm font-bold text-slate-800">+{m} сар</span>
              <span className="block text-[11px] text-slate-500">{formatMNT(m * BILLING.monthlyPrice)}</span>
            </button>
          </form>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <a
          href={`/pay/${person.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-xl bg-slate-100 py-2 text-center text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
        >
          <span className="inline-flex items-center gap-1">
            Төлбөрийн хуудас
            <ArrowUpRightIcon className="size-3.5" />
          </span>
        </a>
      </div>

      <details className="group mt-4 border-t border-slate-100 pt-3">
        <summary className="cursor-pointer list-none text-xs font-semibold text-slate-500 hover:text-slate-800">
          Дуусах огноог гараар засах
        </summary>
        <form action={changePaidUntil.bind(null, person.id)} className="mt-2 flex gap-2">
          <input
            type="date"
            name="paidUntil"
            required
            defaultValue={toDateInput(person.paidUntil)}
            className="min-w-0 flex-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm"
          />
          <button type="submit" className="rounded-lg bg-slate-900 px-3 text-xs font-bold text-white">
            Хадгалах
          </button>
        </form>
      </details>

      {payments.length > 0 && (
        <div className="mt-4 border-t border-slate-100 pt-3">
          <p className="mb-2 text-xs font-semibold text-slate-500">Төлбөрийн түүх</p>
          <ul className="space-y-1.5">
            {payments.map((p) => (
              <li key={p.id} className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{formatDate(p.createdAt)}</span>
                <span className="font-semibold text-slate-700">
                  +{p.months} сар · {formatMNT(p.amount)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
