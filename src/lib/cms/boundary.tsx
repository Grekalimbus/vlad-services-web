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

/**
 * Cloudflare middleware rewrites #cms-data to the live document and the browser
 * executes it into window.__CMS__. React hydration can later restore the RSC
 * fallback into that same script tag. Prefer the already-executed window value
 * when the script was clearly reset back to the boot/fallback payload.
 */
function resolveHardBoot(boot: CmsDocument): CmsDocument {
  if (typeof window === "undefined") return boot;
  const fromScript = newestCmsScript();
  const fromWindow = window.__CMS__;
  if (fromWindow && fromScript && sameCms(fromScript, boot) && !sameCms(fromWindow, boot)) {
    return fromWindow;
  }
  if (fromScript && !sameCms(fromScript, boot)) return fromScript;
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
  const [doc, setDoc] = useState(() => resolveHardBoot(boot));
  const hardBooted = useRef(false);

  useLayoutEffect(() => {
    let cancelled = false;
    const route = pathname.endsWith("/") && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
    const fromScript = newestCmsScript();
    const fromWindow = window.__CMS__;
    const scriptIsBoot = Boolean(fromScript && sameCms(fromScript, boot));

    if (!hardBooted.current) {
      hardBooted.current = true;
      const resolved = resolveHardBoot(boot);
      if (!sameCms(resolved, fromWindow)) publish(resolved, setDoc);
      else setDoc(resolved);
    } else if (fromScript && !scriptIsBoot) {
      publish(fromScript, setDoc);
    } else {
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
