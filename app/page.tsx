import Link from "next/link";
import { BILLING, formatMNT } from "@/lib/billing";
import { BriefcaseIcon, QrIcon, UserIcon } from "@/lib/icons";

export default function Home() {
  const steps = [
    ["Бүртгүүлэх", "Утасны дугаар, нууц үгээрээ бүртгэл үүсгэнэ."],
    ["Мэдээллээ оруулах", "Хувийн танилцуулга эсвэл байгууллагын хоолны цэс."],
    ["Төлбөр төлөх", `Сарын ${formatMNT(BILLING.monthlyPrice)}. Дансаар шилжүүлнэ.`],
    ["QR кодоо авах", "Хэвлээд ширээ, хаалга, нэрийн хуудсандаа байрлуулна."],
  ];

  return (
    <main className="theme-navy min-h-dvh bg-white">
      <header className="hero-bg relative overflow-hidden text-white">
        <div className="hero-dots pointer-events-none absolute inset-0" />
        <nav className="relative mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <span className="flex items-center gap-2 font-extrabold">
            <span className="grid size-9 place-items-center rounded-xl bg-white/10 text-t-accent ring-1 ring-white/20">
              <QrIcon className="size-5" />
            </span>
            QR Профайл
          </span>
          <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-white/90 hover:bg-white/10">
            Нэвтрэх
          </Link>
        </nav>
        <div className="relative mx-auto max-w-5xl px-4 pt-14 pb-24 text-center sm:px-6 sm:pt-20">
          <h1 className="mx-auto max-w-2xl text-4xl leading-tight font-extrabold text-balance sm:text-5xl">
            Танилцуулга, хоолны цэс — нэг QR кодонд
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/75 sm:text-lg">
            QR кодыг уншуулахад таны танилцуулга эсвэл ресторан, кафены цэс утсан дээр шууд нээгдэнэ.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/signup"
              className="rounded-xl bg-t-accent px-6 py-3.5 font-bold text-slate-900 shadow-lg transition hover:brightness-105"
            >
              Бүртгүүлэх
            </Link>
            <Link
              href="/login"
              className="rounded-xl bg-white/10 px-6 py-3.5 font-bold text-white ring-1 ring-white/25 transition hover:bg-white/15"
            >
              Нэвтрэх
            </Link>
          </div>
        </div>
      </header>

      <section className="relative mx-auto -mt-12 max-w-5xl px-4 pb-16 sm:px-6">
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([t, d], i) => (
            <li key={t} className="rounded-2xl bg-white p-5 shadow-[0_10px_30px_-15px_rgba(15,23,42,0.25)] ring-1 ring-slate-100">
              <span className="grid size-8 place-items-center rounded-full bg-brand-900 text-sm font-bold text-gold-400">
                {i + 1}
              </span>
              <p className="mt-3 font-bold text-slate-900">{t}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">{d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {[
            {
              Icon: UserIcon,
              title: "Хувийн танилцуулга",
              text: "Ширээн дээрх нэрийн самбар, нэрийн хуудсанд. Зураг, албан тушаал, ажлын туршлага, холбоо барих мэдээлэл.",
            },
            {
              Icon: BriefcaseIcon,
              title: "Бизнес / Хоолны цэс",
              text: "Ресторан, кафе, дэлгүүрт. Лого, цагийн хуваарь, ангилал бүхий цэс, үнэ, хоолны зураг.",
            },
          ].map(({ Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-slate-200 p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <Icon className="size-5" />
              </span>
              <h2 className="mt-4 text-lg font-bold text-slate-900">{title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">{text}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-slate-500">
          Сарын төлбөр <span className="font-bold text-slate-900">{formatMNT(BILLING.monthlyPrice)}</span> · Хэвлэсэн QR
          код хэзээ ч өөрчлөгдөхгүй
        </p>
      </section>
    </main>
  );
}
