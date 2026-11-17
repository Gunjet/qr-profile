import Link from "next/link";
import { QrIcon } from "@/lib/icons";

export function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <main className="theme-navy page-glow grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2 font-extrabold text-slate-900">
          <span className="grid size-9 place-items-center rounded-xl bg-brand-900 text-gold-400">
            <QrIcon className="size-5" />
          </span>
          QR Профайл
        </Link>
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.4)] ring-1 ring-black/5">
          <div className="px-8 pt-8">
            <h1 className="text-xl font-extrabold text-slate-900">{title}</h1>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}

export const inputCls =
  "w-full rounded-xl border border-slate-200 px-3.5 py-3 text-[15px] outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>
      {children}
    </label>
  );
}
