import Link from "next/link";
import { notFound } from "next/navigation";
import { getPerson } from "@/lib/store";
import { removePerson, savePerson } from "@/app/actions";
import { ChevronLeftIcon, TrashIcon } from "@/lib/icons";
import { PersonForm } from "../_components/PersonForm";
import { QRPanel } from "../_components/QRPanel";

export default async function EditPersonPage({ params, searchParams }: PageProps<"/admin/[id]">) {
  const { id } = await params;
  const sp = await searchParams;
  const person = await getPerson(id);
  if (!person) notFound();

  const created = sp.created === "1";
  const saved = sp.saved === "1";

  return (
    <div>
      <Link href="/admin" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900">
        <ChevronLeftIcon className="size-4" />
        Бүх хүмүүс
      </Link>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{person.name}</h1>
        <form action={removePerson.bind(null, person.id)}>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-400 transition hover:bg-red-50 hover:text-red-600"
          >
            <TrashIcon className="size-4" />
            Устгах
          </button>
        </form>
      </div>

      {(created || saved) && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <span className="grid size-6 place-items-center rounded-full bg-emerald-500 text-xs font-bold text-white">✓</span>
          {created
            ? "Амжилттай нэмлээ! QR код бэлэн боллоо — татаж аваад хэвлээрэй."
            : "Өөрчлөлт хадгалагдлаа. QR код өөрчлөгдөхгүй тул дахин хэвлэх шаардлагагүй."}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <PersonForm person={person} action={savePerson.bind(null, person.id)} submitLabel="Хадгалах" />
        <aside className="order-first lg:order-none">
          <div className={`theme-${person.theme} space-y-6 lg:sticky lg:top-24`}>
            <QRPanel id={person.id} name={person.name} />
            <div className="hidden lg:block">
              <p className="mb-2 text-xs font-bold tracking-wider text-slate-400 uppercase">Урьдчилан харах</p>
              <div className="mx-auto w-[300px] rounded-[2.6rem] bg-slate-900 p-2.5 shadow-[0_30px_60px_-25px_rgba(15,23,42,0.6)]">
                <div className="relative h-[560px] overflow-hidden rounded-[2rem] bg-white">
                  <span className="absolute top-2 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-slate-900" />
                  <iframe
                    key={person.updatedAt}
                    src={`/p/${person.id}`}
                    title="Профайл урьдчилан харах"
                    className="h-[750px] w-[375px] origin-top-left scale-[0.7467] border-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
