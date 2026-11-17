import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPerson } from "@/lib/store";
import { BILLING, EXTEND_OPTIONS, billingStatus, formatDate, formatMNT, refCode } from "@/lib/billing";
import { CopyButton } from "@/app/_components/CopyButton";

export const metadata: Metadata = {
  title: "Төлбөр төлөх",
  robots: { index: false, follow: false },
};

export default async function PayPage({ params }: PageProps<"/pay/[id]">) {
  const { id } = await params;
  const person = await getPerson(id);
  if (!person) notFound();

  const { state, daysLeft } = billingStatus(person.paidUntil, new Date());
  const ref = refCode(person.id);
  const active = state === "active" || state === "expiring";

  return (
    <main className={`theme-${person.theme} page-glow min-h-dvh px-4 py-8 md:py-14`}>
      <div className="mx-auto max-w-md overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)] ring-1 ring-black/5">
        <div className="hero-bg relative px-6 pt-8 pb-7 text-white">
          <div className="hero-dots pointer-events-none absolute inset-0" />
          <p className="relative text-xs font-bold tracking-[0.18em] text-t-accent uppercase">Сарын төлбөр</p>
          <h1 className="relative mt-2 text-xl font-extrabold">{person.name}</h1>
          <p className="relative mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
            {active
              ? `Идэвхтэй · ${formatDate(person.paidUntil)} хүртэл (${daysLeft} хоног)`
              : `Хугацаа дууссан · ${formatDate(person.paidUntil)}`}
          </p>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <p className="mb-2 text-xs font-semibold text-slate-500">Дансны мэдээлэл</p>
            <dl className="divide-y divide-slate-100 rounded-2xl border border-slate-200">
              <Row label="Банк" value={BILLING.bankName} />
              <Row label="Дансны дугаар" value={BILLING.account} copy mono />
              <Row label="Хүлээн авагч" value={BILLING.holder} />
            </dl>
          </div>

          <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
            <p className="text-xs font-semibold text-amber-800">Гүйлгээний утга — заавал бичнэ үү</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="font-mono text-2xl font-extrabold tracking-wide text-slate-900">{ref}</span>
              <CopyButton value={ref} />
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold text-slate-500">Төлөх дүн</p>
            <ul className="grid grid-cols-2 gap-2">
              {EXTEND_OPTIONS.map((m) => (
                <li key={m} className="rounded-xl border border-slate-200 px-3 py-2.5">
                  <p className="text-sm font-bold text-slate-800">{m} сар</p>
                  <p className="text-xs text-slate-500">{formatMNT(m * BILLING.monthlyPrice)}</p>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs leading-relaxed text-slate-500">
            Шилжүүлэг хийсний дараа төлбөрийг шалгаж баталгаажуулмагц профайлын хугацаа сунгагдана. Олон сараар
            төлбөл дүнгээ тохируулан шилжүүлнэ үү.
          </p>
        </div>
      </div>
    </main>
  );
}

function Row({ label, value, copy, mono }: { label: string; value: string; copy?: boolean; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="flex items-center gap-2">
        <span className={`text-sm font-bold text-slate-800 ${mono ? "font-mono tracking-wide" : ""}`}>{value}</span>
        {copy && <CopyButton value={value} />}
      </dd>
    </div>
  );
}
