import { Suspense } from "react";
import { PageSkeleton } from "@/app/_components/PageSkeleton";
import Link from "next/link";
import { listPendingRequests, listPeople } from "@/lib/store";
import { ArrowUpRightIcon, PlusIcon, QrIcon, UserIcon } from "@/lib/icons";
import { Avatar } from "@/app/_components/Avatar";
import { StatusBadge } from "@/app/_components/StatusBadge";
import { billingStatus } from "@/lib/billing";
import { PendingPayments } from "./_components/PendingPayments";

export default function AdminPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AdminPageContent />
    </Suspense>
  );
}

async function AdminPageContent() {
  const [people, pending] = await Promise.all([listPeople(), listPendingRequests()]);
  const now = new Date();
  const states = people.map((p) => (p.paidUntil ? billingStatus(p.paidUntil, now).state : "unpaid"));
  const stats = [
    { label: "Идэвхтэй", value: states.filter((s) => s === "active").length, dot: "bg-emerald-500" },
    { label: "Удахгүй дуусах", value: states.filter((s) => s === "expiring").length, dot: "bg-amber-500" },
    {
      label: "Хугацаа дууссан",
      value: states.filter((s) => s === "grace" || s === "expired").length,
      dot: "bg-red-500",
    },
    { label: "Төлөөгүй", value: states.filter((s) => s === "unpaid").length, dot: "bg-slate-400" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Профайлууд</h1>
          <p className="mt-1 text-sm text-slate-500">Нийт {people.length} профайл · Хүн бүрт тусдаа QR код үүснэ</p>
        </div>
        <Link
          href="/admin/new"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-800"
        >
          <PlusIcon className="size-4" />
          Шинэ профайл
        </Link>
      </div>

      <PendingPayments requests={pending} />

      {people.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-slate-200/70 bg-white px-4 py-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <span className={`size-2 rounded-full ${s.dot}`} />
                {s.label}
              </p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {people.length === 0 ? (
        <div className="mt-10 rounded-3xl border-2 border-dashed border-slate-200 bg-white px-6 py-16 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <QrIcon className="size-7" />
          </span>
          <h2 className="mt-4 font-bold text-slate-800">Одоогоор профайл нэмээгүй байна</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
            Хүний мэдээллийг оруулаад “QR код үүсгэх” дармагц тухайн хүний профайл руу орох QR код бэлэн болно.
          </p>
          <Link
            href="/admin/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-900 px-4 py-2.5 text-sm font-bold text-white"
          >
            <PlusIcon className="size-4" />
            Эхний профайлаа нэмэх
          </Link>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((p) => (
            <li key={p.id}>
              <div
                className={`theme-${p.theme} group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 pt-0 transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-16px_rgba(15,23,42,0.35)]`}
              >
                <div className="hero-bg relative -mx-5 h-16">
                  <div className="hero-dots absolute inset-0" />
                </div>
                <div className="relative -mt-8">
                  <Avatar
                    name={p.name}
                    photo={p.photo}
                    logo={p.kind === "business"}
                    className="size-16 text-lg ring-4 ring-white"
                  />
                  <Link
                    href={`/admin/${p.id}`}
                    className="mt-3 block truncate text-[17px] font-bold text-slate-900 after:absolute after:inset-0"
                  >
                    {p.name}
                  </Link>
                  <p className="truncate text-sm font-semibold text-t-ink">{p.position || "—"}</p>
                  <p className="mt-1 truncate text-xs text-slate-400">
                    {p.ownerPhone ? (
                      <span className="inline-flex items-center gap-1">
                        <UserIcon className="size-3.5" />
                        {p.ownerPhone}
                      </span>
                    ) : (
                      p.organization || " "
                    )}
                  </p>
                  <div className="mt-3">
                    <StatusBadge paidUntil={p.paidUntil} now={now} />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-slate-500">
                    <QrIcon className="size-4 text-t-ink" />
                    /p/{p.id}
                  </span>
                  <a
                    href={`/p/${p.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 inline-flex items-center gap-1 font-semibold text-slate-500 hover:text-brand-600"
                  >
                    Профайл
                    <ArrowUpRightIcon className="size-3.5" />
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
