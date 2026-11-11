"use client";

import { createContext, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { notifyPublished } from "./edit-store";
import { toPublicCms } from "./public-projection";
import type { CmsDocument } from "./types";

export const CmsContext = createContext<CmsDocument | null>(null);

function parseCmsScript(script: HTMLScriptElement | null): CmsDocument | null {
  const raw = script?.textContent?.trim();
  if (!raw?.startsWith("window.__CMS__=")) return null;
  try {
    return JSON.parse(raw.slice("window.__CMS__=".length)) as CmsDocument;
  } catch {
    return null;
  }
}

function newestCmsScript(): CmsDocument | null {
  const scripts = document.querySelectorAll("script#cms-data");
  const last = scripts[scripts.length - 1];
  return parseCmsScript(last instanceof HTMLScriptElement ? last : null);
}

function sameCms(a: CmsDocument | null | undefined, b: CmsDocument | null | undefined) {
  if (!a || !b) return false;
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

function publish(document: CmsDocument, setDoc: (doc: CmsDocument) => void) {
  window.__CMS__ = document;
  setDoc(document);
  notifyPublished();
}

function normalizeRoute(pathname: string) {
  if (pathname.endsWith("/") && pathname.length > 1) return pathname.slice(0, -1);
  return pathname || "/";
}

/** True when this projection already carries the fields the route renders. */
function routePayloadReady(document: CmsDocument, route: string) {
  const path = normalizeRoute(route);
  if (path === "/services/tv-mounting") {
    return Boolean(
      document.copy?.plan?.headingLead?.trim() &&
        (document.copy?.additionals?.cards?.length ?? 0) > 0 &&
        ((document.copy as { tvShowcase?: { cards?: unknown[] } }).tvShowcase?.cards?.length ?? 0) > 0,
    );
  }
  if (path.startsWith("/services/")) {
    const slug = path.slice("/services/".length);
    const category = document.serviceCategories?.find((item) => item.slug === slug || item.id === slug);
    if (!category) return false;
    const landings = (document.copy as { serviceLanding?: Record<string, unknown> }).serviceLanding;
    return Boolean(landings?.[category.id]);
  }
  return true;
}

/**
 * Cloudflare middleware rewrites #cms-data to the live document and the browser
 * executes it into window.__CMS__. React hydration can later restore the RSC
 * fallback into that same script tag. Prefer the already-executed window value
 * when the script was clearly reset back to the boot/fallback payload.
 *
 * Soft navigations inject a new script without executing it, so window.__CMS__
 * can still hold the previous route's lean projection — never prefer that over a
 * boot payload that is already ready for the current route.
 */
function resolveHardBoot(boot: CmsDocument, route: string): CmsDocument {
  if (typeof window === "undefined") return boot;
  const fromScript = newestCmsScript();
  const fromWindow = window.__CMS__;
  const bootReady = routePayloadReady(boot, route);
  const windowReady = fromWindow ? routePayloadReady(fromWindow, route) : false;

  if (fromWindow && !sameCms(fromWindow, boot)) {
    if (bootReady && !windowReady) return boot;
    if (!bootReady && windowReady) return fromWindow;
  }

  if (fromWindow && fromScript && sameCms(fromScript, boot) && !sameCms(fromWindow, boot)) {
    // Hard refresh only: keep middleware-executed live content over RSC fallback.
    if (!bootReady || windowReady) return fromWindow;
  }
  if (fromScript && !sameCms(fromScript, boot) && routePayloadReady(fromScript, route)) return fromScript;
  if (bootReady) return boot;
  return fromWindow ?? fromScript ?? boot;
}

/**
 * Keep route CMS in sync without flashing the static-export fallback on refresh.
 */
export function CmsBoundary({
  payload,
  path,
  children,
}: {
  payload: string;
  path: string;
  children: ReactNode;
}) {
  const pathname = usePathname() || path;
  const boot = useMemo(() => JSON.parse(payload) as CmsDocument, [payload]);
  const [doc, setDoc] = useState(() => resolveHardBoot(boot, path));
  const hardBooted = useRef(false);
  const lastRoute = useRef(normalizeRoute(path));

  useLayoutEffect(() => {
    let cancelled = false;
    const route = normalizeRoute(pathname || path);
    const fromScript = newestCmsScript();
    const fromWindow = window.__CMS__;
    const scriptIsBoot = Boolean(fromScript && sameCms(fromScript, boot));
    const routeChanged = lastRoute.current !== route;
    lastRoute.current = route;

    if (!hardBooted.current) {
      hardBooted.current = true;
      const resolved = resolveHardBoot(boot, route);
      if (!sameCms(resolved, fromWindow)) publish(resolved, setDoc);
      else setDoc(resolved);
    } else if (routeChanged) {
      // Soft nav: RSC boot is authoritative for the new route; window may be stale.
      publish(boot, setDoc);
    } else if (fromScript && !scriptIsBoot && routePayloadReady(fromScript, route)) {
      publish(fromScript, setDoc);
    } else if (!routePayloadReady(window.__CMS__ as CmsDocument, route)) {
      publish(boot, setDoc);
    }

    (async () => {
      try {
        const response = await fetch("/api/content", { cache: "no-store" });
        if (!response.ok || cancelled) return;
        const full = (await response.json()) as CmsDocument;
        if (cancelled) return;
        const projected = toPublicCms(full, route || path);
        if (sameCms(projected, window.__CMS__)) return;
        // Avoid replacing a ready route payload with an empty/lean projection.
        if (
          window.__CMS__ &&
          routePayloadReady(window.__CMS__, route) &&
          !routePayloadReady(projected, route)
        ) {
          return;
        }
        publish(projected, setDoc);
      } catch {
        /* keep bootstrap / script snapshot */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname, path, boot]);

  return <CmsContext.Provider value={doc}>{children}</CmsContext.Provider>;
}
