"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { ArrowUpRightIcon, CopyIcon, DownloadIcon } from "@/lib/icons";

const QR_OPTS = {
  errorCorrectionLevel: "M" as const,
  margin: 1,
  color: { dark: "#000000", light: "#ffffff" }, // pure black: best contrast for scanning and printing
};

export function QRPanel({ id, name }: { id: string; name: string }) {
  const [url, setUrl] = useState("");
  const [svg, setSvg] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Set NEXT_PUBLIC_SITE_URL to your real domain so printed codes point to production.
    const base = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const u = `${base.replace(/\/$/, "")}/p/${id}`;
    QRCode.toString(u, { ...QR_OPTS, type: "svg" }).then((s) => {
      setUrl(u);
      setSvg(s);
    });
  }, [id]);

  const fileBase = `qr-${name.replace(/\s+/g, "-") || id}`;

  async function downloadPng() {
    const dataUrl = await QRCode.toDataURL(url, { ...QR_OPTS, width: 1200 });
    trigger(dataUrl, `${fileBase}.png`);
  }
  function downloadSvg() {
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const href = URL.createObjectURL(blob);
    trigger(href, `${fileBase}.svg`);
    URL.revokeObjectURL(href);
  }
  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white">
      <div className="hero-bg relative px-6 pt-6 pb-7 text-center">
        <div className="hero-dots pointer-events-none absolute inset-0" />
        <p className="relative text-[11px] font-bold tracking-[0.2em] text-t-accent uppercase">QR код</p>
        <div className="relative mx-auto mt-4 aspect-square w-full max-w-[220px] rounded-2xl bg-white p-3 shadow-xl">
          {svg ? (
            <div className="size-full [&>svg]:size-full" dangerouslySetInnerHTML={{ __html: svg }} />
          ) : (
            <div className="size-full animate-pulse rounded-lg bg-slate-100" />
          )}
        </div>
        <p className="relative mt-4 truncate text-sm font-bold text-white">{name}</p>
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 py-1.5 pr-1.5 pl-3">
          <span className="min-w-0 flex-1 truncate font-mono text-xs text-slate-500">{url || "…"}</span>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200 hover:text-brand-600"
          >
            <CopyIcon className="size-3.5" />
            {copied ? "Хуулсан" : "Хуулах"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={downloadPng}
            disabled={!url}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-900 py-2.5 text-sm font-bold text-white transition hover:bg-brand-800"
          >
            <DownloadIcon className="size-4" />
            PNG
          </button>
          <button
            type="button"
            onClick={downloadSvg}
            disabled={!svg}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-50 py-2.5 text-sm font-bold text-brand-700 transition hover:bg-brand-100"
          >
            <DownloadIcon className="size-4" />
            SVG (хэвлэх)
          </button>
        </div>

        <a
          href={`/p/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:text-brand-600"
        >
          Профайл нээх
          <ArrowUpRightIcon className="size-4" />
        </a>
      </div>
    </div>
  );
}

function trigger(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
