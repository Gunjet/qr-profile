import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_MAX_AGE, sessionToken } from "./auth";

// Kept apart from lib/auth.ts, which proxy.ts imports.
export async function startAdminSession() {
  (await cookies()).set(SESSION_COOKIE, (await sessionToken())!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function endAdminSession() {
  (await cookies()).delete(SESSION_COOKIE);
}
