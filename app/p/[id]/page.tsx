import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPerson } from "@/lib/store";
import type { Social } from "@/lib/types";
import {
  ArrowUpRightIcon,
  BriefcaseIcon,
  FacebookIcon,
  GlobeIcon,
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  QrIcon,
  UserPlusIcon,
  XIcon,
  YoutubeIcon,
} from "@/lib/icons";
import { Khee } from "./Khee";
import { HeroTools } from "./HeroTools";

export async function generateMetadata({ params }: PageProps<"/p/[id]">): Promise<Metadata> {
  const { id } = await params;
  const person = await getPerson(id);
  if (!person) return { title: "Олдсонгүй" };
  return {
    title: `${person.name} — ${person.position}`,
    description: person.organization || person.position,
  };
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function mapHref(address: string, mapUrl: string) {
  if (mapUrl) return mapUrl;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

const socialMeta: Record<Social["type"], { name: string; Icon: typeof FacebookIcon; className: string }> = {
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

export default async function ProfilePage({ params }: PageProps<"/p/[id]">) {
  const { id } = await params;
  const person = await getPerson(id);
  if (!person) notFound();

  const tel = (s: string) => `tel:${s.replace(/\s/g, "")}`;
  const primaryPhone = person.phones[0];
  const hasContacts = person.phones.length > 0 || person.email || person.address;

  const actions = [
    primaryPhone && { href: tel(primaryPhone), label: "Залгах", icon: <PhoneIcon className="size-[22px]" /> },
    person.email && { href: `mailto:${person.email}`, label: "Имэйл", icon: <MailIcon className="size-[22px]" /> },
    person.address && {
      href: mapHref(person.address, person.mapUrl),
      label: "Байршил",
      icon: <PinIcon className="size-[22px]" />,
      external: true,
    },
    { href: `/p/${person.id}/vcard`, label: "Хадгалах", icon: <UserPlusIcon className="size-[22px]" /> },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode; external?: boolean }[];

  return (
    <main className={`theme-${person.theme} page-glow min-h-dvh md:py-10`}>
      <div className="mx-auto max-w-md overflow-clip bg-t-bg md:rounded-[2.25rem] md:shadow-[0_30px_80px_-30px_rgba(15,23,42,0.45)] md:ring-1 md:ring-black/5">
        {/* ───────── HERO ───────── */}
        <header className="hero-bg relative overflow-hidden rounded-b-[2.25rem] px-5 pt-5 pb-[104px] text-white">
          <div className="hero-dots pointer-events-none absolute inset-0" />

          <div className="relative flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 py-1.5 pr-3 pl-2 text-[11px] font-bold tracking-wide text-white/80 ring-1 ring-white/15 backdrop-blur-md">
              <QrIcon className="size-3.5 text-t-accent" />
              QR ПРОФАЙЛ
            </span>
            <HeroTools name={person.name} position={person.position} />
          </div>

          <div className="rise relative mt-7 text-center">
            <div className="relative mx-auto w-fit">
              <div className="absolute -inset-6 rounded-full bg-t-accent/25 blur-2xl" />
              <div className="relative rounded-full bg-[conic-gradient(from_160deg,var(--t-accent),#fff_35%,var(--t-accent)_60%,#fff_85%,var(--t-accent))] p-[3px] shadow-[0_18px_50px_-12px_rgba(0,0,0,0.6)]">
                <div className="rounded-full bg-t-hero3 p-[5px]">
                  {person.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={person.photo} alt={person.name} className="size-[132px] rounded-full object-cover" />
                  ) : (
                    <div className="grid size-[132px] place-items-center rounded-full bg-gradient-to-br from-t-hero1 to-t-hero3 text-[42px] font-extrabold tracking-tight text-t-accent">
                      {initials(person.name)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <h1 className="mt-6 text-[1.7rem] leading-[1.15] font-extrabold tracking-tight text-balance">
              {person.name}
            </h1>
            {person.position && (
              <p className="mt-2 inline-flex items-center gap-2 text-[13px] font-bold tracking-[0.2em] text-t-accent uppercase">
                <span className="h-px w-5 bg-t-accent/60" />
                {person.position}
                <span className="h-px w-5 bg-t-accent/60" />
              </p>
            )}
            {person.organization && (
              <p className="mx-auto mt-4 w-fit max-w-full rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/90 ring-1 ring-white/15 backdrop-blur-md">
                {person.organization}
              </p>
            )}
          </div>

          <Khee className="absolute inset-x-0 bottom-[62px] text-white/[0.16] [mask-image:linear-gradient(90deg,transparent,black_20%,black_80%,transparent)]" />
        </header>

        {/* ───────── QUICK ACTIONS ───────── */}
        <nav
          className="rise relative z-10 mx-4 -mt-12 grid gap-1 rounded-[1.75rem] bg-white p-2 shadow-[0_18px_40px_-18px_rgba(15,23,42,0.35)] ring-1 ring-black/[0.03]"
          style={{ gridTemplateColumns: `repeat(${actions.length}, minmax(0, 1fr))`, animationDelay: "80ms" }}
        >
          {actions.map((a) => (
            <a
              key={a.label}
              href={a.href}
              {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex flex-col items-center gap-1.5 rounded-2xl py-3 transition hover:bg-slate-50 active:scale-95 active:bg-slate-100"
            >
              <span className="grid size-11 place-items-center rounded-full bg-t-soft text-t-ink transition duration-200 group-hover:scale-110">
                {a.icon}
              </span>
              <span className="text-[11px] font-bold text-slate-600">{a.label}</span>
            </a>
          ))}
        </nav>

        <div className="space-y-4 px-4 pt-6 pb-6">
          {/* ABOUT */}
          {person.about && (
            <Card title="Танилцуулга" delay={120}>
              <div className="relative pl-4">
                <span className="absolute top-0 left-0 h-full w-[3px] rounded-full bg-gradient-to-b from-t-accent to-t-accent/0" />
                <p className="text-[15px] leading-relaxed whitespace-pre-line text-slate-600">{person.about}</p>
              </div>
            </Card>
          )}

          {/* EXPERIENCE */}
          {person.experience.length > 0 && (
            <Card title="Ажлын туршлага" count={person.experience.length} delay={160}>
              <ol className="relative">
                {person.experience.map((e, i) => {
                  const current = i === 0;
                  const last = i === person.experience.length - 1;
                  return (
                    <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
                      {!last && <span className="absolute top-7 bottom-0 left-[13px] w-px bg-slate-200" />}
                      <span
                        className={`relative mt-0.5 grid size-[27px] shrink-0 place-items-center rounded-full ${
                          current ? "bg-t-primary text-t-accent" : "bg-t-soft text-t-ink"
                        }`}
                      >
                        <BriefcaseIcon className="size-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {e.period && (
                            <span className="text-xs font-bold tracking-wide text-slate-400">{e.period}</span>
                          )}
                          {current && /одоо/i.test(e.period) && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                              ОДОО
                            </span>
                          )}
                        </div>
                        <p
                          className={`mt-1 text-[15px] leading-snug ${
                            current ? "font-bold text-slate-900" : "font-semibold text-slate-700"
                          }`}
                        >
                          {e.title}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </Card>
          )}

          {/* CONTACTS */}
          {hasContacts && (
            <Card title="Холбоо барих" delay={200}>
              <ul className="-my-1 divide-y divide-slate-100">
                {person.phones.map((ph, i) => (
                  <ContactRow
                    key={ph}
                    href={tel(ph)}
                    icon={<PhoneIcon className="size-5" />}
                    label={i === 0 ? "Гар утас" : "Утас"}
                    value={ph}
                  />
                ))}
                {person.email && (
                  <ContactRow
                    href={`mailto:${person.email}`}
                    icon={<MailIcon className="size-5" />}
                    label="Имэйл"
                    value={person.email}
                  />
                )}
                {person.address && (
                  <ContactRow
                    href={mapHref(person.address, person.mapUrl)}
                    external
                    icon={<PinIcon className="size-5" />}
                    label="Хаяг"
                    value={person.address}
                    wrap
                  />
                )}
              </ul>
            </Card>
          )}

          {/* SOCIALS */}
          {person.socials.length > 0 && (
            <Card title="Сошиал сүлжээ" delay={240}>
              <ul className="space-y-2">
                {person.socials.map((s, i) => {
                  const meta = socialMeta[s.type];
                  return (
                    <li key={i}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3.5 rounded-2xl bg-slate-50 p-2.5 pr-4 transition hover:bg-t-soft"
                      >
                        <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${meta.className}`}>
                          <meta.Icon className="size-[22px]" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[15px] font-bold text-slate-800">{meta.name}</span>
                          {s.label && <span className="block truncate text-xs text-slate-500">{s.label}</span>}
                        </span>
                        <ArrowUpRightIcon className="size-5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-t-ink" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}

          <footer className="flex flex-col items-center gap-3 pt-6 pb-2">
            <Khee className="w-40 text-t-ink/20" />
            <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-400 uppercase">QR Профайл</p>
          </footer>
        </div>

        {/* ───────── STICKY SAVE CONTACT ───────── */}
        <div className="sticky bottom-0 z-20 bg-gradient-to-t from-t-bg via-t-bg/95 to-transparent px-4 pt-6 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <a
            href={`/p/${person.id}/vcard`}
            className="flex items-center justify-center gap-2.5 rounded-2xl bg-t-primary py-4 text-[15px] font-bold text-white shadow-[0_14px_30px_-12px_var(--t-primary)] transition hover:brightness-110 active:scale-[0.98]"
          >
            <UserPlusIcon className="size-5 text-t-accent" />
            Утсандаа хадгалах
          </a>
        </div>
      </div>
    </main>
  );
}

function Card({
  title,
  count,
  delay = 0,
  children,
}: {
  title: string;
  count?: number;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rise rounded-[1.75rem] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_-16px_rgba(15,23,42,0.16)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h2 className="mb-4 flex items-center gap-2 text-[11px] font-extrabold tracking-[0.18em] text-slate-400 uppercase">
        <span className="size-1.5 rotate-45 bg-t-accent" />
        {title}
        {count !== undefined && (
          <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] tracking-normal text-slate-500">
            {count}
          </span>
        )}
      </h2>
      {children}
    </section>
  );
}

function ContactRow({
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
        <ArrowUpRightIcon className="size-4 text-slate-300 transition group-hover:text-t-ink" />
      </a>
    </li>
  );
}
