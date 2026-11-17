import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, isValidSession } from "@/lib/auth";
import { USER_COOKIE } from "@/lib/user-cookie";

// First gate only — pages and server actions re-check sessions themselves.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin area (except its login page) needs the admin cookie.
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    if (await isValidSession(request.cookies.get(SESSION_COOKIE)?.value)) return NextResponse.next();
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Account area: bounce visitors with no session cookie straight to /login.
  // (The cookie itself is verified against the database by the page.)
  if (pathname.startsWith("/account") && !request.cookies.has(USER_COOKIE)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/account", "/account/:path*"],
};
