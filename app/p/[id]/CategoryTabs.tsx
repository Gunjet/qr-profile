"use client";

import { useEffect, useRef, useState } from "react";

// Sticky category bar with scroll-spy: highlights the section in view and
// keeps the active tab scrolled into the bar.
export function CategoryTabs({ titles }: { titles: string[] }) {
  const [active, setActive] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = titles.map((_, i) => document.getElementById(`menu-${i}`)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(Number(visible[0].target.id.replace("menu-", "")));
      },
      { rootMargin: "-72px 0px -60% 0px" },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [titles]);

  useEffect(() => {
    const tab = barRef.current?.querySelector<HTMLElement>(`[data-i="${active}"]`);
    tab?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [active]);

  return (
    <nav className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/95 backdrop-blur">
      <div ref={barRef} className="flex gap-6 overflow-x-auto px-6 [scrollbar-width:none]">
        {titles.map((t, i) => (
          <a
            key={i}
            data-i={i}
            href={`#menu-${i}`}
            onClick={() => setActive(i)}
            className={`relative shrink-0 py-3.5 text-sm whitespace-nowrap transition ${
              active === i ? "font-semibold text-slate-900" : "font-medium text-slate-400 hover:text-slate-700"
            }`}
          >
            {t}
            <span
              className={`absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-t-ink transition-opacity ${
                active === i ? "opacity-100" : "opacity-0"
              }`}
            />
          </a>
        ))}
      </div>
    </nav>
  );
}
