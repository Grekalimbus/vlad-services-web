import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { permanentRedirects } from "@/lib/seo";

const legacyRedirects = new Map(permanentRedirects().map((redirect) => [redirect.source, redirect.destination]));

/** Cache policy and legacy redirects. CMS HTML is rendered by the route, not rewritten here. */
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const destination = legacyRedirects.get(path) ?? legacyRedirects.get(path.replace(/\/$/, "") || "/");
  if (destination && destination !== path) {
    return NextResponse.redirect(new URL(destination, request.url), 301);
  }
  const response = NextResponse.next();
  if (path.startsWith("/_next/static") || path.startsWith("/api/media")) return response;
  response.headers.set("Cache-Control", "private, no-store");
  if (path.startsWith("/admin") || path.startsWith("/api")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
