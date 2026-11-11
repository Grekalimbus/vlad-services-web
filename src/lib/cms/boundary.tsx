"use client";

import { createContext, useLayoutEffect, useMemo, useState, type ReactNode } from "react";
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

function publish(document: CmsDocument, setDoc: (doc: CmsDocument) => void) {
  window.__CMS__ = document;
  setDoc(document);
  notifyPublished();
}

/**
 * Keeps route-projected CMS in sync for soft navigations.
 *
 * On Cloudflare static Pages, client transitions inject a new <script id="cms-data">
 * without executing it, so window.__CMS__ can stay on the previous page's lean
 * payload (empty TV fields). Soft-nav can also reuse this boundary instance, so we
 * key off pathname, adopt the newest script, then refresh from /api/content.
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
  const [doc, setDoc] = useState(boot);

  useLayoutEffect(() => {
    publish(boot, setDoc);
  }, [boot]);

  useLayoutEffect(() => {
    let cancelled = false;
    const route = pathname.endsWith("/") && pathname.length > 1 ? pathname.slice(0, -1) : pathname;

    const fromScript = newestCmsScript();
    if (fromScript) publish(fromScript, setDoc);

    (async () => {
      try {
        const response = await fetch("/api/content", { cache: "no-store" });
        if (!response.ok || cancelled) return;
        const full = (await response.json()) as CmsDocument;
        if (cancelled) return;
        publish(toPublicCms(full, route || path), setDoc);
      } catch {
        /* keep bootstrap / script snapshot */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname, path]);

  return <CmsContext.Provider value={doc}>{children}</CmsContext.Provider>;
}
