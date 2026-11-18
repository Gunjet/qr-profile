// Public page for a business profile: a restaurant / café menu.
import type { MenuItem, Person } from "@/lib/types";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon } from "@/lib/icons";
import { HeroTools } from "./HeroTools";
import { CategoryTabs } from "./CategoryTabs";
import { MenuPhoto } from "./MenuPhoto";
import { mapHref, socialMeta, tel } from "./ui";

const price = (n: number) => `${n.toLocaleString("en-US")}₮`;

export function MenuView({ person }: { person: Person }) {
  const sections = person.menu.filter((s) => s.items.length > 0);
  const primaryPhone = person.phones[0];

  return (
    <main className={`theme-${person.theme} min-h-dvh bg-[#f6f3ee] md:py-10`}>
      <div className="mx-auto max-w-md overflow-clip bg-white md:rounded-[2rem] md:shadow-[0_30px_80px_-40px_rgba(15,23,42,0.5)] md:ring-1 md:ring-black/5">
        {/* ───────── Header ───────── */}
        <header className="hero-bg relative overflow-hidden px-6 pt-5 pb-8 text-white">
          <div className="hero-dots pointer-events-none absolute inset-0" />

          {/* Top bar: brand logo in the corner, share on the right */}
          <div className="relative flex min-h-10 items-center justify-between gap-4">
            {person.photo ? (
              <span className="inline-flex rounded-xl bg-white p-1.5 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={person.photo} alt={person.name} className="h-9 w-auto max-w-[140px] object-contain" />
              </span>
            ) : (
              <span />
            )}
            <HeroTools name={person.name} position={person.position} />
          </div>

          <div className="relative mt-10">
            {person.position && (
              <p className="text-[11px] font-semibold tracking-[0.28em] text-t-accent uppercase">{person.position}</p>
            )}
            <h1 className="mt-2 font-serif text-[2.15rem] leading-[1.1] font-semibold text-balance">{person.name}</h1>

            {(person.hours || person.address) && (
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-white/75">
                {person.hours && (
                  <span className="inline-flex items-center gap-1.5">
                    <ClockIcon className="size-3.5" />
                    {person.hours}
                  </span>
                )}
                {person.address && (
                  <span className="inline-flex items-center gap-1.5">
                    <PinIcon className="size-3.5" />
                    {person.address}
                  </span>
                )}
              </div>
            )}

            {(primaryPhone || person.address) && (
              <div className="mt-6 flex gap-2.5">
                {primaryPhone && (
                  <a
                    href={tel(primaryPhone)}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white/90"
                  >
                    <PhoneIcon className="size-4" />
                    Залгах
                  </a>
                )}
                {person.address && (
                  <a
                    href={mapHref(person.address, person.mapUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/10"
                  >
                    <PinIcon className="size-4" />
                    Чиглэл
                  </a>
                )}
              </div>
            )}
          </div>
        </header>

        {/* ───────── Category tabs ───────── */}
        {sections.length > 1 && <CategoryTabs titles={sections.map((s) => s.title || "Цэс")} />}

        {/* ───────── Menu ───────── */}
        <div className="px-6">
          {sections.length === 0 && <p className="py-20 text-center text-sm text-slate-400">Цэс удахгүй нэмэгдэнэ.</p>}

          {sections.map((s, i) => (
            <section key={i} id={`menu-${i}`} className="scroll-mt-14 pt-9 pb-2">
              {s.title && (
                <header className="mb-1 flex items-baseline justify-between gap-4">
                  <h2 className="font-serif text-[1.5rem] leading-none font-semibold text-slate-900">{s.title}</h2>
                  <span className="text-xs text-slate-400 tabular-nums">{s.items.length}</span>
                </header>
              )}
              <ul>
                {s.items.map((it, j) => (
                  <MenuRow key={j} item={it} />
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* ───────── Info ───────── */}
        <footer className="mt-8 border-t border-slate-100 bg-[#fbfaf8] px-6 pt-8 pb-10">
          {person.about && (
            <p className="mx-auto max-w-sm text-center font-serif text-lg leading-relaxed whitespace-pre-line text-slate-700 italic">
              {person.about}
            </p>
          )}

          <div className={`space-y-3 text-sm ${person.about ? "mt-8" : ""}`}>
            {person.hours && (
              <InfoRow icon={<ClockIcon className="size-4" />} label="Цагийн хуваарь" value={person.hours} />
            )}
            {person.address && (
              <InfoRow
                icon={<PinIcon className="size-4" />}
                label="Хаяг"
                value={person.address}
                href={mapHref(person.address, person.mapUrl)}
                external
              />
            )}
            {person.phones.map((ph) => (
              <InfoRow key={ph} icon={<PhoneIcon className="size-4" />} label="Утас" value={ph} href={tel(ph)} />
            ))}
            {person.email && (
              <InfoRow
                icon={<MailIcon className="size-4" />}
                label="Имэйл"
                value={person.email}
                href={`mailto:${person.email}`}
              />
            )}
          </div>

          {person.socials.length > 0 && (
            <div className="mt-8 flex justify-center gap-3">
              {person.socials.map((s, i) => {
                const meta = socialMeta[s.type];
                return (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label || meta.name}
                    title={s.label || meta.name}
                    className="grid size-11 place-items-center rounded-full bg-white text-slate-600 ring-1 ring-slate-200 transition hover:text-slate-900 hover:ring-slate-300"
                  >
                    <meta.Icon className="size-5" />
                  </a>
                );
              })}
            </div>
          )}
        </footer>
      </div>
    </main>
  );
}

function MenuRow({ item }: { item: MenuItem }) {
  return (
    <li className="flex gap-4 border-b border-slate-100 py-5 last:border-0">
      {item.photo && <MenuPhoto src={item.photo} alt={item.name} caption={item.description} />}
      <div className="min-w-0 flex-1 self-center">
        <div className="flex items-baseline gap-2">
          <h3 className="text-[15px] leading-snug font-semibold text-slate-900">{item.name}</h3>
          {item.price != null && (
            <>
              <span aria-hidden className="min-w-4 flex-1 translate-y-[-3px] border-b border-dotted border-slate-300" />
              <span className="text-[15px] font-semibold whitespace-nowrap text-slate-900 tabular-nums">
                {price(item.price)}
              </span>
            </>
          )}
        </div>
        {item.description && <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{item.description}</p>}
      </div>
    </li>
  );
}

function InfoRow({
  icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const body = (
    <>
      <span className="flex w-32 shrink-0 items-center gap-2 text-slate-400">
        {icon}
        {label}
      </span>
      <span className="min-w-0 font-medium text-slate-800">{value}</span>
    </>
  );
  return href ? (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="flex items-start gap-3 hover:text-slate-900"
    >
      {body}
    </a>
  ) : (
    <div className="flex items-start gap-3">{body}</div>
  );
}
