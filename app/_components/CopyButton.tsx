"use client";

import { useState } from "react";
import { CopyIcon } from "@/lib/icons";

export function CopyButton({ value, label = "Хуулах" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:text-brand-600"
    >
      <CopyIcon className="size-3.5" />
      {copied ? "Хуулсан" : label}
    </button>
  );
}
