import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/users";
import { getPendingRequest, getPersonByOwner } from "@/lib/store";
import { BILLING, EXTEND_OPTIONS, billingStatus, formatDate, formatMNT, refCode } from "@/lib/billing";
import { cancelPaymentRequest } from "@/app/account-actions";
import { CopyButton } from "@/app/_components/CopyButton";
import { QRPanel } from "@/app/_components/QRPanel";
import { StatusBadge } from "@/app/_components/StatusBadge";
import { Avatar } from "@/app/_components/Avatar";
import { EditIcon } from "@/lib/icons";
import { PlanPicker } from "./PlanPicker";

export default async function AccountPage({ searchParams }: PageProps<"/account">) {
  const user = await currentUser();
  if (!user) redirect("/login");
  const sp = await searchParams;

  const person = await getPersonByOwner(user.id);
  const pending = person ? await getPendingRequest(person.id) : null;
  const now = new Date();
  const status = person ? billingStatus(person.paidUntil, now) : null;
  const live = !!status?.visible;
  const everPaid = !!person?.paidUntil;

  const banner =
    sp.created === "1"
      ? "Профайл хадгалагдлаа! Одоо төлбөрөө төлөөд QR кодоо аваарай."
      : sp.saved === "1"
        ? "Өөрчлөлт хадгалагдлаа."
        : sp.requested === "1"
          ? "Баярлалаа! Төлбөрийг шалгаад удахгүй баталгаажуулна."
          : null;

  const step = !person ? 1 : !live ? 2 : 3;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Сайн байна уу, {user.name}</h1>
        <p className="mt-1 text-sm text-slate-500">{user.phone}</p>
      </div>

      {banner && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-emerald-500 text-xs font-bold text-white">
            ✓
          </span>
          {banner}
        </div>
      )}

      {/* Steps */}
      <ol className="grid grid-cols-3 gap-2">
        {["Мэдээлэл оруулах", "Төлбөр төлөх", "QR код авах"].map((label, i) => {
          const n = i + 1;
          const done = n < step;
          const current = n === step;
          return (
            <li
              key={label}
              className={`rounded-xl border px-3 py-2.5 ${
                current ? "border-brand-600 bg-white" : done ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white/60"
              }`}
            >
              <span
                className={`grid size-6 place-items-center rounded-full text-xs font-bold ${
                  done ? "bg-emerald-500 text-white" : current ? "bg-brand-900 text-gold-400" : "bg-slate-200 text-slate-500"
                }`}
              >
                {done ? "✓" : n}
              </span>
              <p className={`mt-1.5 text-xs font-semibold ${current ? "text-slate-900" : "text-slate-500"}`}>{label}</p>
            </li>
          );
        })}
      </ol>

      {/* Step 1: no profile yet */}
      {!person && (
        <section className="rounded-2xl border border-slate-200/70 bg-white p-8 text-center">
          <h2 className="text-lg font-bold text-slate-900">Профайлаа үүсгэе</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
            Зураг, нэр, албан тушаал, туршлага, холбоо барих мэдээллээ оруулна. Төлбөр төлөхөөс өмнө урьдчилан харж болно.
          </p>
          <Link
            href="/account/profile"
            className="mt-6 inline-flex rounded-xl bg-brand-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-800"
          >
            Мэдээлэл оруулах
          </Link>
        </section>
      )}

      {person && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {/* Profile summary */}
            <section className={`theme-${person.theme} rounded-2xl border border-slate-200/70 bg-white p-5`}>
              <div className="flex items-center gap-4">
                <Avatar name={person.name} photo={person.photo} className="size-14 text-lg" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-slate-900">{person.name}</p>
                  <p className="truncate text-sm text-slate-500">{person.position || "—"}</p>
                </div>
                {everPaid && <StatusBadge paidUntil={person.paidUntil} now={now} />}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/account/profile"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                >
                  <EditIcon className="size-4" />
                  Засах
                </Link>
                <Link
                  href="/account/preview"
                  className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Урьдчилан харах
                </Link>
                {live && (
                  <a
                    href={`/p/${person.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                  >
                    Нийтэд харагдах хуудас ↗
                  </a>
                )}
              </div>
              {everPaid && (
                <p className="mt-3 text-xs text-slate-500">
                  Хугацаа: <span className="font-semibold text-slate-700">{formatDate(person.paidUntil)}</span> хүртэл
                </p>
              )}
            </section>

            {/* Payment */}
            <section className="rounded-2xl border border-slate-200/70 bg-white p-5">
              <h2 className="font-bold text-slate-900">{live ? "Хугацаа сунгах" : "Төлбөр төлөх"}</h2>
              <p className="mt-0.5 text-sm text-slate-500">
                Сарын төлбөр {formatMNT(BILLING.monthlyPrice)}.{" "}
                {live ? "Хугацаа дуусахаас өмнө сунгаарай." : "Төлбөр баталгаажмагц QR код гарч ирнэ."}
              </p>

              {pending ? (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="font-semibold text-amber-900">⏳ Төлбөр шалгагдаж байна</p>
                  <p className="mt-1 text-sm text-amber-800">
                    {pending.months} сар · {formatMNT(pending.amount)} · {formatDate(pending.createdAt)}-нд илгээсэн
                  </p>
                  <form action={cancelPaymentRequest.bind(null, pending.id)} className="mt-3">
                    <button type="submit" className="text-xs font-semibold text-amber-700 underline-offset-2 hover:underline">
                      Цуцлах
                    </button>
                  </form>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  <dl className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                    <BankRow label="Банк" value={BILLING.bankName} />
                    <BankRow label="Дансны дугаар" value={BILLING.account} copy mono />
                    <BankRow label="Хүлээн авагч" value={BILLING.holder} />
                    <BankRow label="Гүйлгээний утга" value={refCode(person.id)} copy mono highlight />
                  </dl>
                  <PlanPicker options={EXTEND_OPTIONS} monthlyPrice={BILLING.monthlyPrice} />
                </div>
              )}
            </section>
          </div>

          {/* QR */}
          <aside className={`theme-${person.theme}`}>
            {live ? (
              <QRPanel id={person.id} name={person.name} />
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-6 text-center">
                <div className="mx-auto grid aspect-square w-full max-w-[200px] place-items-center rounded-2xl bg-slate-50 text-5xl text-slate-300">
                  🔒
                </div>
                <p className="mt-4 font-semibold text-slate-700">QR код</p>
                <p className="mt-1 text-xs text-slate-500">
                  {everPaid ? "Хугацаа дууссан. Сунгасны дараа дахин идэвхжинэ." : "Төлбөр баталгаажсаны дараа энд гарч ирнэ."}
                </p>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

function BankRow({
  label,
  value,
  copy,
  mono,
  highlight,
}: {
  label: string;
  value: string;
  copy?: boolean;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between gap-3 px-4 py-2.5 ${highlight ? "bg-amber-50" : ""}`}>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="flex items-center gap-2">
        <span className={`text-sm font-bold text-slate-800 ${mono ? "font-mono" : ""}`}>{value}</span>
        {copy && <CopyButton value={value} />}
      </dd>
    </div>
  );
}
