"use client";

import { useRef, useState } from "react";
import type { MenuSection } from "@/lib/types";
import { CameraIcon, ChevronLeftIcon, PlusIcon, TrashIcon } from "@/lib/icons";
import { resizeImage } from "./resizeImage";

type Item = { key: number; name: string; description: string; price: string; photo: string };
type Section = { key: number; title: string; items: Item[] };

let seq = 0;
const k = () => ++seq;
const blankItem = (): Item => ({ key: k(), name: "", description: "", price: "", photo: "" });

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10";

function move<T>(list: T[], from: number, to: number) {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [x] = next.splice(from, 1);
  next.splice(to, 0, x);
  return next;
}

/** Edits the menu and posts it as JSON in a hidden "menu" input. */
export function MenuEditor({ initial }: { initial: MenuSection[] }) {
  const [sections, setSections] = useState<Section[]>(() =>
    (initial.length ? initial : [{ title: "", items: [] }]).map((s) => ({
      key: k(),
      title: s.title,
      items: (s.items.length ? s.items : [{ name: "", description: "", price: null, photo: "" }]).map((i) => ({
        key: k(),
        name: i.name,
        description: i.description,
        price: i.price == null ? "" : String(i.price),
        photo: i.photo,
      })),
    })),
  );

  const json = JSON.stringify(
    sections.map((s) => ({
      title: s.title,
      items: s.items.map(({ name, description, price, photo }) => ({ name, description, price, photo })),
    })),
  );

  const updateSection = (sk: number, patch: Partial<Section>) =>
    setSections((xs) => xs.map((s) => (s.key === sk ? { ...s, ...patch } : s)));
  const updateItem = (sk: number, ik: number, patch: Partial<Item>) =>
    setSections((xs) =>
      xs.map((s) => (s.key === sk ? { ...s, items: s.items.map((i) => (i.key === ik ? { ...i, ...patch } : i)) } : s)),
    );

  return (
    <div className="space-y-4">
      <input type="hidden" name="menu" value={json} />

      {sections.map((sec, si) => (
        <div key={sec.key} className="rounded-xl border border-slate-200 bg-slate-50/60">
          <div className="flex items-center gap-2 border-b border-slate-200 p-3">
            <input
              value={sec.title}
              onChange={(e) => updateSection(sec.key, { title: e.target.value })}
              placeholder="Ангилал (жишээ: Үндсэн хоол)"
              className={`${inputCls} font-semibold`}
            />
            <OrderButtons
              onUp={() => setSections((xs) => move(xs, si, si - 1))}
              onDown={() => setSections((xs) => move(xs, si, si + 1))}
              first={si === 0}
              last={si === sections.length - 1}
            />
            <IconButton
              label="Ангилал устгах"
              onClick={() => setSections((xs) => xs.filter((s) => s.key !== sec.key))}
              danger
            >
              <TrashIcon className="size-4" />
            </IconButton>
          </div>

          <ul className="divide-y divide-slate-200">
            {sec.items.map((it, ii) => (
              <li key={it.key} className="flex gap-3 p-3">
                <PhotoPicker value={it.photo} onChange={(photo) => updateItem(sec.key, it.key, { photo })} />
                <div className="grid min-w-0 flex-1 gap-2">
                  <div className="grid gap-2 sm:grid-cols-[1fr_140px]">
                    <input
                      value={it.name}
                      onChange={(e) => updateItem(sec.key, it.key, { name: e.target.value })}
                      placeholder="Хоолны нэр"
                      className={inputCls}
                    />
                    <div className="relative">
                      <input
                        value={it.price}
                        onChange={(e) => updateItem(sec.key, it.key, { price: e.target.value.replace(/[^\d]/g, "") })}
                        inputMode="numeric"
                        placeholder="Үнэ"
                        className={`${inputCls} pr-7`}
                      />
                      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-slate-400">
                        ₮
                      </span>
                    </div>
                  </div>
                  <input
                    value={it.description}
                    onChange={(e) => updateItem(sec.key, it.key, { description: e.target.value })}
                    placeholder="Тайлбар (заавал биш)"
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <OrderButtons
                    vertical
                    onUp={() => updateSection(sec.key, { items: move(sec.items, ii, ii - 1) })}
                    onDown={() => updateSection(sec.key, { items: move(sec.items, ii, ii + 1) })}
                    first={ii === 0}
                    last={ii === sec.items.length - 1}
                  />
                  <IconButton
                    label="Хоол устгах"
                    onClick={() => updateSection(sec.key, { items: sec.items.filter((i) => i.key !== it.key) })}
                    danger
                  >
                    <TrashIcon className="size-4" />
                  </IconButton>
                </div>
              </li>
            ))}
          </ul>

          <div className="p-2">
            <button
              type="button"
              onClick={() => updateSection(sec.key, { items: [...sec.items, blankItem()] })}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-brand-600 transition hover:bg-brand-50"
            >
              <PlusIcon className="size-4" />
              Хоол нэмэх
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setSections((xs) => [...xs, { key: k(), title: "", items: [blankItem()] }])}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 py-3 text-sm font-semibold text-slate-500 transition hover:border-brand-500 hover:text-brand-600"
      >
        <PlusIcon className="size-4" />
        Ангилал нэмэх
      </button>
    </div>
  );
}

function PhotoPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="flex shrink-0 flex-col items-center gap-1">
      <button
        type="button"
        onClick={() => ref.current?.click()}
        aria-label="Зураг оруулах"
        className="grid size-16 place-items-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-white text-slate-400 transition hover:border-brand-500 hover:text-brand-500"
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="size-full object-cover" />
        ) : (
          <CameraIcon className="size-5" />
        )}
      </button>
      {value && (
        <button type="button" onClick={() => onChange("")} className="text-[10px] font-semibold text-slate-400 hover:text-red-500">
          Устгах
        </button>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) onChange(await resizeImage(f, 480, 0.78));
          e.target.value = "";
        }}
      />
    </div>
  );
}

function OrderButtons({
  onUp,
  onDown,
  first,
  last,
  vertical,
}: {
  onUp: () => void;
  onDown: () => void;
  first: boolean;
  last: boolean;
  vertical?: boolean;
}) {
  return (
    <div className={`flex ${vertical ? "flex-col" : ""} gap-1`}>
      <IconButton label="Дээш" onClick={onUp} disabled={first}>
        <ChevronLeftIcon className="size-4 rotate-90" />
      </IconButton>
      <IconButton label="Доош" onClick={onDown} disabled={last}>
        <ChevronLeftIcon className="size-4 -rotate-90" />
      </IconButton>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 transition disabled:opacity-30 ${
        danger ? "hover:bg-red-50 hover:text-red-500" : "hover:bg-slate-200 hover:text-slate-700"
      }`}
    >
      {children}
    </button>
  );
}
