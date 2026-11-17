"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { CloseIcon, QrIcon, ShareIcon } from "@/lib/icons";

// Top-right hero buttons: native share + "show my QR" sheet.
export function HeroTools({ name, position }: { name: string; position: string }) {
  const [open, setOpen] = useState(false);
  const [svg, setSvg] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!open || svg) return;
    QRCode.toString(window.location.href.split("?")[0], {
      type: "svg",
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#0f172a", light: "#ffffff" },
    }).then(setSvg);
  }, [open, svg]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function share() {
    const url = window.location.href.split("?")[0];
    if (navigator.share) {
      try {
        await navigator.share({ title: name, text: position, url });
      } catch {
        /* cancelled */
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setToast("Холбоос хуулагдлаа");
    setTimeout(() => setToast(""), 1600);
  }

  const btn =
    "grid size-10 place-items-center rounded-full bg-white/12 text-white ring-1 ring-white/20 backdrop-blur-md transition hover:bg-white/20 active:scale-95";

  return (
    <>
      <div className="flex gap-2">
        <button type="button" onClick={() => setOpen(true)} className={btn} aria-label="QR код харуулах">
          <QrIcon className="size-[18px]" />
        </button>
        <button type="button" onClick={share} className={btn} aria-label="Хуваалцах">
          <ShareIcon className="size-[18px]" />
        </button>
      </div>

      {toast && (
        <div className="pop fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-6 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="QR код"
            onClick={(e) => e.stopPropagation()}
            className="pop relative w-full max-w-xs overflow-hidden rounded-[28px] bg-white text-center shadow-2xl"
          >
            <div className="hero-bg px-6 pt-6 pb-16">
              <p className="text-[11px] font-bold tracking-[0.2em] text-t-accent uppercase">Миний QR код</p>
              <p className="mt-1.5 font-bold text-white">{name}</p>
            </div>
            <div className="-mt-12 px-6 pb-6">
              <div className="mx-auto aspect-square w-full rounded-2xl bg-white p-3 shadow-[0_10px_40px_-10px_rgba(15,23,42,0.35)] ring-1 ring-slate-100">
                {svg ? (
                  <div className="size-full [&>svg]:size-full" dangerouslySetInnerHTML={{ __html: svg }} />
                ) : (
                  <div className="size-full animate-pulse rounded-lg bg-slate-100" />
                )}
              </div>
              <p className="mt-4 text-xs text-slate-500">Камераараа уншуулж профайлыг нээнэ</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Хаах"
              className="absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25"
            >
              <CloseIcon className="size-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
