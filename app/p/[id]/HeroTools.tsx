"use client";

import { useState } from "react";
import { ShareIcon } from "@/lib/icons";

// Top-right hero button: lets a visitor share this profile link.
export function HeroTools({ name, position }: { name: string; position: string }) {
  const [toast, setToast] = useState("");

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

  return (
    <>
      <button
        type="button"
        onClick={share}
        aria-label="Хуваалцах"
        className="grid size-10 place-items-center rounded-full bg-white/12 text-white ring-1 ring-white/20 backdrop-blur-md transition hover:bg-white/20 active:scale-95"
      >
        <ShareIcon className="size-[18px]" />
      </button>

      {toast && (
        <div className="pop fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}
    </>
  );
}
