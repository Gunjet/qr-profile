import type { PersonInput } from "./store";
import { SOCIAL_TYPES, type MenuSection, type SocialType } from "./types";
import { themeOf } from "./themes";

// Parses + sanitizes the profile form. Profiles are now user-submitted, so
// links are restricted to http(s) and photos to small raster data URLs.

const MAX_PHOTO_CHARS = 1_500_000; // ~1.1 MB image
const MAX_SVG_CHARS = 280_000; // ~200 KB SVG logo
const MAX_ITEM_PHOTO_CHARS = 250_000; // menu photos are resized to 480px on the client
const MENU_LIMIT = { sections: 30, items: 80 };
const LIMIT = { short: 120, long: 2000, items: 20 };

const clip = (s: string, n: number) => s.trim().slice(0, n);
const str = (fd: FormData, key: string, n = LIMIT.short) => clip(String(fd.get(key) ?? ""), n);
const all = (fd: FormData, key: string, n = LIMIT.short) =>
  fd
    .getAll(key)
    .slice(0, LIMIT.items)
    .map((v) => clip(String(v), n));

function safeUrl(raw: string) {
  try {
    const u = new URL(raw.includes("://") ? raw : `https://${raw}`);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : "";
  } catch {
    return "";
  }
}

const isImage = (s: unknown, max: number): s is string =>
  typeof s === "string" && s.length <= max && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(s);

/** The menu editor posts its state as JSON in a hidden "menu" field. */
function parseMenu(raw: string): MenuSection[] {
  let data: unknown;
  try {
    data = JSON.parse(raw || "[]");
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];
  return data
    .slice(0, MENU_LIMIT.sections)
    .map((sec) => {
      const s = (sec ?? {}) as { title?: unknown; items?: unknown };
      const items = (Array.isArray(s.items) ? s.items : []).slice(0, MENU_LIMIT.items).map((it) => {
        const i = (it ?? {}) as Record<string, unknown>;
        const price = Number(String(i.price ?? "").replace(/[^\d.]/g, ""));
        return {
          name: clip(String(i.name ?? ""), LIMIT.short),
          description: clip(String(i.description ?? ""), 300),
          price: Number.isFinite(price) && price > 0 ? Math.min(Math.round(price), 100_000_000) : null,
          photo: isImage(i.photo, MAX_ITEM_PHOTO_CHARS) ? i.photo : "",
        };
      });
      return { title: clip(String(s.title ?? ""), LIMIT.short), items: items.filter((i) => i.name) };
    })
    .filter((s) => s.title || s.items.length);
}

export function parsePersonForm(fd: FormData): PersonInput {
  const periods = all(fd, "exp_period");
  const titles = all(fd, "exp_title");
  const experience = titles.map((title, i) => ({ period: periods[i] ?? "", title })).filter((e) => e.title || e.period);

  const sTypes = all(fd, "social_type");
  const sLabels = all(fd, "social_label");
  const sUrls = all(fd, "social_url", 500);
  const validTypes = new Set(SOCIAL_TYPES.map((s) => s.value));
  const socials = sUrls
    .map((url, i) => ({
      type: (validTypes.has(sTypes[i] as SocialType) ? sTypes[i] : "website") as SocialType,
      label: sLabels[i] ?? "",
      url: safeUrl(url),
    }))
    .filter((s) => s.url);

  const photo = String(fd.get("photo") ?? "");
  const kind = str(fd, "kind") === "business" ? "business" : "person";
  // Business logos may also be SVG (shown via <img>, where scripts never run).
  const photoOk =
    (/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(photo) && photo.length <= MAX_PHOTO_CHARS) ||
    (kind === "business" &&
      /^data:image\/svg\+xml;base64,[A-Za-z0-9+/=]+$/.test(photo) &&
      photo.length <= MAX_SVG_CHARS);

  const mapUrl = str(fd, "mapUrl", 500);

  return {
    kind,
    hours: kind === "business" ? str(fd, "hours", 300) : "",
    menu: kind === "business" ? parseMenu(String(fd.get("menu") ?? "")) : [],
    name: str(fd, "name"),
    position: str(fd, "position"),
    organization: str(fd, "organization"),
    photo: photoOk ? photo : "",
    about: str(fd, "about", LIMIT.long),
    experience: kind === "person" ? experience : [],
    phones: all(fd, "phone", 30).filter(Boolean),
    email: str(fd, "email"),
    address: str(fd, "address", 300),
    mapUrl: mapUrl ? safeUrl(mapUrl) : "",
    socials,
    theme: themeOf(str(fd, "theme")),
  };
}
