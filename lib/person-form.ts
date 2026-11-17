import type { PersonInput } from "./store";
import { SOCIAL_TYPES, type SocialType } from "./types";
import { themeOf } from "./themes";

// Parses + sanitizes the profile form. Profiles are now user-submitted, so
// links are restricted to http(s) and photos to small raster data URLs.

const MAX_PHOTO_CHARS = 1_500_000; // ~1.1 MB image
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

export function parsePersonForm(fd: FormData): PersonInput {
  const periods = all(fd, "exp_period");
  const titles = all(fd, "exp_title");
  const experience = titles
    .map((title, i) => ({ period: periods[i] ?? "", title }))
    .filter((e) => e.title || e.period);

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
  const photoOk = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(photo) && photo.length <= MAX_PHOTO_CHARS;

  const mapUrl = str(fd, "mapUrl", 500);

  return {
    name: str(fd, "name"),
    position: str(fd, "position"),
    organization: str(fd, "organization"),
    photo: photoOk ? photo : "",
    about: str(fd, "about", LIMIT.long),
    experience,
    phones: all(fd, "phone", 30).filter(Boolean),
    email: str(fd, "email"),
    address: str(fd, "address", 300),
    mapUrl: mapUrl ? safeUrl(mapUrl) : "",
    socials,
    theme: themeOf(str(fd, "theme")),
  };
}
