"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import type { Person } from "@/lib/types";
import { SOCIAL_TYPES } from "@/lib/types";
import { THEMES, themeOf } from "@/lib/themes";
import { CameraIcon, PlusIcon, QrIcon, TrashIcon } from "@/lib/icons";

type Row<T> = T & { key: number };
let keySeq = 0;
const withKey = <T,>(v: T): Row<T> => ({ ...v, key: ++keySeq });

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10";

export function PersonForm({
  person,
  action,
  submitLabel,
}: {
  person?: Person;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}) {
  const [photo, setPhoto] = useState(person?.photo ?? "");
  const [theme, setTheme] = useState<string>(themeOf(person?.theme));
  const [experience, setExperience] = useState(() =>
    (person?.experience.length ? person.experience : [{ period: "", title: "" }]).map(withKey),
  );
  const [phones, setPhones] = useState(() =>
    (person?.phones.length ? person.phones : [""]).map((value) => withKey({ value })),
  );
  const [socials, setSocials] = useState(() =>
    (person?.socials ?? []).map(withKey),
  );
  const fileRef = useRef<HTMLInputElement>(null);

  async function onPhoto(file: File | undefined) {
    if (!file) return;
    setPhoto(await resizeImage(file, 480));
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="photo" value={photo} />

      <Section title="Үндсэн мэдээлэл" hint="Профайлын дээд хэсэгт харагдана">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="group relative grid size-32 place-items-center overflow-hidden rounded-full border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 transition hover:border-brand-500 hover:text-brand-500"
            >
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="" className="size-full object-cover" />
              ) : (
                <span className="flex flex-col items-center gap-1 text-xs font-semibold">
                  <CameraIcon className="size-7" />
                  Зураг
                </span>
              )}
              {photo && (
                <span className="absolute inset-0 grid place-items-center bg-black/40 text-white opacity-0 transition group-hover:opacity-100">
                  <CameraIcon className="size-7" />
                </span>
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onPhoto(e.target.files?.[0])}
            />
            {photo && (
              <button
                type="button"
                onClick={() => setPhoto("")}
                className="text-xs font-semibold text-slate-400 hover:text-red-500"
              >
                Зураг устгах
              </button>
            )}
          </div>

          <div className="grid flex-1 gap-4">
            <Field label="Овог нэр" required>
              <input name="name" required defaultValue={person?.name} placeholder="Жишээ: Батболд Ганзориг" className={inputCls} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Албан тушаал">
                <input name="position" defaultValue={person?.position} placeholder="Засаг дарга" className={inputCls} />
              </Field>
              <Field label="Байгууллага / нэгж">
                <input
                  name="organization"
                  defaultValue={person?.organization}
                  placeholder="Даланзадгад сум, 7-р баг"
                  className={inputCls}
                />
              </Field>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Өнгөний загвар" hint="Профайл хуудасны өнгө">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {THEMES.map((t) => (
            <label key={t.id} className="group cursor-pointer">
              <input
                type="radio"
                name="theme"
                value={t.id}
                checked={theme === t.id}
                onChange={() => setTheme(t.id)}
                className="peer sr-only"
              />
              <span
                className="relative block aspect-[4/5] overflow-hidden rounded-xl ring-2 ring-transparent ring-offset-2 transition peer-checked:ring-slate-900 peer-focus-visible:ring-brand-500 group-hover:-translate-y-0.5"
                style={{ background: `linear-gradient(160deg, ${t.from}, ${t.to})` }}
              >
                <span
                  className="absolute top-3 left-1/2 size-6 -translate-x-1/2 rounded-full ring-2"
                  style={{ background: "rgba(255,255,255,.25)", boxShadow: `0 0 0 2px ${t.accent}` }}
                />
                <span className="absolute top-11 left-1/2 h-1.5 w-8 -translate-x-1/2 rounded-full bg-white/80" />
                <span
                  className="absolute top-14 left-1/2 h-1 w-5 -translate-x-1/2 rounded-full"
                  style={{ background: t.accent }}
                />
                <span className="absolute inset-x-1.5 bottom-1.5 h-5 rounded-md bg-white/95" />
              </span>
              <span className="mt-1.5 block text-center text-[11px] font-semibold text-slate-500 peer-checked:text-slate-900">
                {t.name}
              </span>
            </label>
          ))}
        </div>
      </Section>

      <Section title="Танилцуулга" hint="Товч намтар, зорилго гэх мэт (заавал биш)">
        <textarea
          name="about"
          rows={4}
          defaultValue={person?.about}
          placeholder="Өөрийн тухай товч танилцуулга…"
          className={`${inputCls} resize-y`}
        />
      </Section>

      <Section title="Ажлын туршлага" hint="Хамгийн сүүлийнхийг эхэнд нь бичнэ">
        <div className="space-y-3">
          {experience.map((e, i) => (
            <div key={e.key} className="flex items-start gap-2">
              <span className="mt-3 grid size-6 shrink-0 place-items-center rounded-full bg-brand-50 text-[11px] font-bold text-brand-600">
                {i + 1}
              </span>
              <div className="grid flex-1 gap-2 sm:grid-cols-[150px_1fr]">
                <input name="exp_period" defaultValue={e.period} placeholder="2019–2023" className={inputCls} />
                <input
                  name="exp_title"
                  defaultValue={e.title}
                  placeholder="ХХААГазарт ахлах мэргэжилтэн"
                  className={inputCls}
                />
              </div>
              <RemoveButton onClick={() => setExperience((xs) => xs.filter((x) => x.key !== e.key))} />
            </div>
          ))}
          <AddButton onClick={() => setExperience((xs) => [...xs, withKey({ period: "", title: "" })])}>
            Туршлага нэмэх
          </AddButton>
        </div>
      </Section>

      <Section title="Холбоо барих">
        <div className="grid gap-4">
          <Field label="Утасны дугаар">
            <div className="space-y-2">
              {phones.map((p) => (
                <div key={p.key} className="flex gap-2">
                  <input name="phone" type="tel" defaultValue={p.value} placeholder="8800 0000" className={inputCls} />
                  <RemoveButton onClick={() => setPhones((xs) => xs.filter((x) => x.key !== p.key))} />
                </div>
              ))}
              <AddButton onClick={() => setPhones((xs) => [...xs, withKey({ value: "" })])}>Дугаар нэмэх</AddButton>
            </div>
          </Field>
          <Field label="Имэйл">
            <input name="email" type="email" defaultValue={person?.email} placeholder="name@example.com" className={inputCls} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Хаяг">
              <input
                name="address"
                defaultValue={person?.address}
                placeholder="Даланзадгад, Өмнөговь"
                className={inputCls}
              />
            </Field>
            <Field label="Google Maps холбоос (заавал биш)">
              <input name="mapUrl" type="url" defaultValue={person?.mapUrl} placeholder="https://maps.app.goo.gl/…" className={inputCls} />
            </Field>
          </div>
        </div>
      </Section>

      <Section title="Сошиал сүлжээ" hint="Facebook хуудас, групп гэх мэт">
        <div className="space-y-3">
          {socials.map((s) => (
            <div key={s.key} className="flex items-start gap-2">
              <div className="grid flex-1 gap-2 sm:grid-cols-[140px_1fr_1.4fr]">
                <select name="social_type" defaultValue={s.type} className={inputCls}>
                  {SOCIAL_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <input name="social_label" defaultValue={s.label} placeholder="Багийн фэйсбүүк групп" className={inputCls} />
                <input name="social_url" type="url" defaultValue={s.url} placeholder="https://facebook.com/…" className={inputCls} />
              </div>
              <RemoveButton onClick={() => setSocials((xs) => xs.filter((x) => x.key !== s.key))} />
            </div>
          ))}
          <AddButton
            onClick={() => setSocials((xs) => [...xs, withKey({ type: "facebook" as const, label: "", url: "" })])}
          >
            Холбоос нэмэх
          </AddButton>
        </div>
      </Section>

      <div className="sticky bottom-4 z-10 flex justify-end">
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2.5 rounded-2xl bg-brand-900 px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_12px_30px_-10px_rgba(11,42,107,0.7)] transition hover:bg-brand-800 disabled:opacity-60"
    >
      <QrIcon className="size-5 text-gold-400" />
      {pending ? "Хадгалж байна…" : label}
    </button>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-2xl border border-slate-200/70 bg-white p-5 sm:p-6">
      <legend className="sr-only">{title}</legend>
      <div className="mb-5">
        <h2 className="font-bold text-slate-900">{title}</h2>
        {hint && <p className="mt-0.5 text-xs text-slate-400">{hint}</p>}
      </div>
      {children}
    </fieldset>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}

function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-brand-600 transition hover:bg-brand-50"
    >
      <PlusIcon className="size-4" />
      {children}
    </button>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Устгах"
      className="mt-1 grid size-9 shrink-0 place-items-center rounded-lg text-slate-300 transition hover:bg-red-50 hover:text-red-500"
    >
      <TrashIcon className="size-4" />
    </button>
  );
}

function resizeImage(file: File, size: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const s = Math.min(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      // center-crop to a square
      ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = reject;
    img.src = url;
  });
}
