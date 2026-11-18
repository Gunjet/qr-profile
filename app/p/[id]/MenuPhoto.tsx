"use client";

import { useEffect, useState } from "react";
import { CloseIcon } from "@/lib/icons";

// Item thumbnail that opens a larger view on tap.
export function MenuPhoto({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${alt} — томруулж харах`}
        className="size-[88px] shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-black/5"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" className="size-full object-cover transition duration-300 hover:scale-105" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-6 backdrop-blur-sm"
        >
          <figure className="pop w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} className="aspect-square w-full rounded-3xl object-cover shadow-2xl" />
            <figcaption className="mt-4 text-center text-white">
              <span className="block font-serif text-xl font-semibold">{alt}</span>
              {caption && <span className="mt-1 block text-sm text-white/70">{caption}</span>}
            </figcaption>
          </figure>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Хаах"
            className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>
      )}
    </>
  );
}
