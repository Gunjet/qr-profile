import Link from "next/link";
import { savePerson } from "@/app/actions";
import { ChevronLeftIcon } from "@/lib/icons";
import { PersonForm } from "../_components/PersonForm";

export default function NewPersonPage() {
  return (
    <div>
      <Link href="/admin" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900">
        <ChevronLeftIcon className="size-4" />
        Буцах
      </Link>
      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">Шинэ хүн нэмэх</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <PersonForm action={savePerson.bind(null, null)} submitLabel="Хадгалаад QR код үүсгэх" />

        <aside className="order-first lg:order-none">
          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 lg:sticky lg:top-24">
            <h2 className="font-bold text-slate-900">Хэрхэн ажилладаг вэ?</h2>
            <ol className="mt-4 space-y-4">
              {[
                ["Мэдээлэл оруулах", "Зураг, нэр, албан тушаал, туршлага, холбоо барих мэдээлэл."],
                ["QR код үүсгэх", "Хадгалмагц тухайн хүнд зориулсан QR код автоматаар үүснэ."],
                ["Хэвлэх, байршуулах", "PNG/SVG татаж аваад ширээний самбар, нэрийн хуудсанд хэвлэнэ."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-900 text-xs font-bold text-gold-400">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{t}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
