import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import { QrIcon } from "@/lib/icons";

export const metadata: Metadata = { title: "Нэвтрэх — QR Профайл" };

export default function LoginPage() {
  return (
    <main className="theme-navy page-glow grid min-h-dvh place-items-center px-4">
      <div className="w-full max-w-sm overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.45)] ring-1 ring-black/5">
        <div className="hero-bg relative px-8 pt-10 pb-12 text-center text-white">
          <div className="hero-dots pointer-events-none absolute inset-0" />
          <span className="relative mx-auto grid size-14 place-items-center rounded-2xl bg-white/10 text-t-accent ring-1 ring-white/20 backdrop-blur">
            <QrIcon className="size-7" />
          </span>
          <h1 className="relative mt-4 text-xl font-extrabold">QR Профайл</h1>
          <p className="relative mt-1 text-sm text-white/70">Админ хэсэгт нэвтрэх</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
