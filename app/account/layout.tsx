import Link from "next/link";
import { QrIcon } from "@/lib/icons";
import { logout } from "@/app/account-actions";

export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link href="/account" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-brand-900 text-gold-400">
              <QrIcon className="size-5" />
            </span>
            <span className="text-[15px] font-extrabold tracking-tight text-slate-900">QR Профайл</span>
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Гарах
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
