import type { Person } from "@/lib/types";

// Shown to visitors when the subscription (plus grace period) has ended.
// Deliberately reveals no profile details.
export function Inactive({ person }: { person: Person }) {
  return (
    <main className={`theme-${person.theme} page-glow grid min-h-dvh place-items-center px-6`}>
      <div className="w-full max-w-sm rounded-[2rem] bg-white p-8 text-center shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)] ring-1 ring-black/5">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-t-soft text-2xl text-t-ink">⏸</span>
        <h1 className="mt-5 text-lg font-bold text-slate-900">Профайл түр идэвхгүй байна</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Энэ профайл одоогоор харагдахгүй байна. Түр хүлээгээд дахин оролдоно уу.
        </p>
        <a
          href={person.ownerId ? "/login" : `/pay/${person.id}`}
          className="mt-8 inline-block text-xs font-semibold text-slate-400 underline-offset-4 hover:text-t-ink hover:underline"
        >
          Профайлын эзэн үү? Төлбөр төлөх →
        </a>
      </div>
    </main>
  );
}
