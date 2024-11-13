import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Get the language from the cookies
  const cookie = req.headers.get("cookie");
  let cookieLanguage = "en"; // Default language

  if (cookie) {
    const cookies = Object.fromEntries(
      cookie.split("; ").map((c) => c.split("="))
    );
    cookieLanguage = cookies["language"] || "en"; // Use cookie or default to "en"
  }

  // Exclude paths that should not be locale-prefixed
  if (
    pathname.startsWith("/_next") || // Static files
    pathname.startsWith("/api") || // API routes
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Redirect to the cookie language if no locale is specified
  if (!pathname.startsWith("/vi") && !pathname.startsWith("/en")) {
    return NextResponse.redirect(
      new URL(`/${cookieLanguage}${pathname}`, req.url)
    );
  }

  // Apply internationalization middleware
  return createMiddleware(routing)(req);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api).*)", // Exclude paths like _next/static, favicon, and API routes
  ],
};
