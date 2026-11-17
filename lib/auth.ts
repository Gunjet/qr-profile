// Minimal single-password admin auth.
// The session cookie holds HMAC(ADMIN_PASSWORD, "qr-profile-admin"), so changing
// the password on Vercel logs everyone out. Uses Web Crypto so it also runs in proxy.ts.

export const SESSION_COOKIE = "qp_admin";
export const ADMIN_USERNAME = "admin"; // typed into the normal /login form
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

async function hmac(key: string, msg: string) {
  const enc = new TextEncoder();
  const k = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
  const sig = await crypto.subtle.sign("HMAC", k, enc.encode(msg));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function password() {
  const p = process.env.ADMIN_PASSWORD;
  if (!p) {
    // Allow a default only for local development.
    if (process.env.NODE_ENV !== "production") return "admin";
    return null;
  }
  return p;
}

export async function sessionToken() {
  const p = password();
  return p ? hmac(p, "qr-profile-admin") : null;
}

export async function isValidSession(token: string | undefined) {
  const expected = await sessionToken();
  return !!token && !!expected && safeEqual(token, expected);
}

export async function checkPassword(input: string) {
  const p = password();
  if (!p) return false;
  // Compare HMACs so the comparison is constant-length.
  return safeEqual(await hmac(p, input), await hmac(p, p));
}
