// Shared building blocks for the public profile and menu pages.
import type { Social } from "@/lib/types";
import { FacebookIcon, GlobeIcon, InstagramIcon, XIcon, YoutubeIcon } from "@/lib/icons";

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function mapHref(address: string, mapUrl: string) {
  if (mapUrl) return mapUrl;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export const socialMeta: Record<Social["type"], { name: string; Icon: typeof FacebookIcon; className: string }> = {
  facebook: { name: "Facebook", Icon: FacebookIcon, className: "bg-[#1877f2] text-white" },
  instagram: {
    name: "Instagram",
    Icon: InstagramIcon,
    className: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white",
  },
  youtube: { name: "YouTube", Icon: YoutubeIcon, className: "bg-[#ff0033] text-white" },
  x: { name: "X", Icon: XIcon, className: "bg-black text-white" },
  website: { name: "Вэбсайт", Icon: GlobeIcon, className: "bg-t-soft text-t-ink" },
};

export function Card({ title, delay = 0, children }: { title: string; delay?: number; children: React.ReactNode }) {
  return (
    <section
      className="rise rounded-[1.75rem] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_-16px_rgba(15,23,42,0.16)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h2 className="mb-4 flex items-center gap-2 text-[11px] font-extrabold tracking-[0.18em] text-slate-400 uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function ContactRow({
  href,
  icon,
  label,
  value,
  external,
  wrap,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  external?: boolean;
  wrap?: boolean;
}) {
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group flex items-center gap-4 py-3"
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-t-soft text-t-ink">{icon}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-semibold text-slate-400">{label}</span>
          <span className={`mt-0.5 block text-[15px] font-bold text-slate-800 ${wrap ? "" : "truncate"}`}>{value}</span>
        </span>
      </a>
    </li>
  );
}

export const tel = (s: string) => `tel:${s.replace(/\s/g, "")}`;
