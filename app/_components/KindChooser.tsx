import Link from "next/link";
import { BriefcaseIcon, UserIcon } from "@/lib/icons";
import type { ProfileKind } from "@/lib/types";

const KINDS: { kind: ProfileKind; title: string; text: string; Icon: typeof UserIcon }[] = [
  {
    kind: "person",
    title: "Хувийн танилцуулга",
    text: "Зураг, албан тушаал, ажлын туршлага, холбоо барих мэдээлэл. Ширээн дээрх нэрийн самбар, нэрийн хуудсанд.",
    Icon: UserIcon,
  },
  {
    kind: "business",
    title: "Бизнес / Хоолны цэс",
    text: "Ресторан, кафе, дэлгүүрт. Лого, цагийн хуваарь, ангилал бүхий цэс, үнэ, зураг.",
    Icon: BriefcaseIcon,
  },
];

/** Step shown before the form when a new profile is created. */
export function KindChooser({ basePath }: { basePath: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {KINDS.map(({ kind, title, text, Icon }) => (
        <Link
          key={kind}
          href={`${basePath}?kind=${kind}`}
          className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-brand-500 hover:shadow-[0_12px_30px_-16px_rgba(11,42,107,0.35)]"
        >
          <span className="grid size-12 place-items-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-900 group-hover:text-gold-400">
            <Icon className="size-6" />
          </span>
          <h2 className="mt-4 text-lg font-bold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">{text}</p>
          <span className="mt-4 inline-block text-sm font-semibold text-brand-600">Сонгох</span>
        </Link>
      ))}
    </div>
  );
}

export const parseKind = (v: unknown): ProfileKind | null =>
  v === "person" || v === "business" ? v : null;
