import Link from "next/link";
import { confirmPaymentRequest, rejectPaymentRequest } from "@/app/actions";
import { formatDate, formatMNT, refCode } from "@/lib/billing";
import type { PaymentRequest } from "@/lib/types";

export function PendingPayments({ requests }: { requests: PaymentRequest[] }) {
  if (requests.length === 0) return null;

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-amber-200 bg-white">
      <div className="flex items-center gap-2 border-b border-amber-100 bg-amber-50 px-5 py-3">
        <span className="grid size-6 place-items-center rounded-full bg-amber-500 text-xs font-bold text-white">
          {requests.length}
        </span>
        <h2 className="font-bold text-amber-900">Хүлээгдэж буй төлбөр</h2>
        <span className="ml-auto hidden text-xs text-amber-800 sm:block">
          Банкны апп дээрээ гүйлгээний утгаар шалгаад баталгаажуулна уу
        </span>
      </div>
      <ul className="divide-y divide-slate-100">
        {requests.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4">
            <div className="min-w-0 flex-1">
              <Link href={`/admin/${r.personId}`} className="font-semibold text-slate-900 hover:underline">
                {r.personName}
              </Link>
              <p className="text-xs text-slate-500">
                {r.ownerPhone ?? "—"} · {formatDate(r.createdAt)}
              </p>
            </div>
            <div className="text-sm">
              <p className="font-mono font-bold text-slate-800">{refCode(r.personId)}</p>
              <p className="text-xs text-slate-500">
                {r.months} сар · <span className="font-semibold text-slate-700">{formatMNT(r.amount)}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <form action={rejectPaymentRequest.bind(null, r.id)}>
                <button
                  type="submit"
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                >
                  Татгалзах
                </button>
              </form>
              <form action={confirmPaymentRequest.bind(null, r.id)}>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  Баталгаажуулах
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
