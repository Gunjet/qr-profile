// Profile color themes. Each id maps to a `.theme-<id>` class in globals.css
// that defines the --t-* CSS variables used by the profile page.
export const THEMES = [
  { id: "navy", name: "Хөх мөнх", from: "#1d4ed8", to: "#061637", accent: "#f5b70a" },
  { id: "emerald", name: "Ногоон тал", from: "#2f8f6b", to: "#0f2620", accent: "#e7c27d" },
  { id: "crimson", name: "Улаан", from: "#c81e3a", to: "#3a0610", accent: "#f5c451" },
  { id: "sky", name: "Цэнхэр тэнгэр", from: "#38bdf8", to: "#0c2d4a", accent: "#fde047" },
  { id: "steppe", name: "Говь", from: "#c2884d", to: "#3d2614", accent: "#fde7b0" },
  { id: "midnight", name: "Шөнө", from: "#475569", to: "#020617", accent: "#a5b4fc" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];
export const DEFAULT_THEME: ThemeId = "navy";

export function themeOf(id: string | undefined): ThemeId {
  return THEMES.some((t) => t.id === id) ? (id as ThemeId) : DEFAULT_THEME;
}
