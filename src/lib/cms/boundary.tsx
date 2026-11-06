"use client";

import { createContext, useLayoutEffect, useMemo, type ReactNode } from "react";
import { notifyPublished } from "./edit-store";
import type { CmsDocument } from "./types";

export const CmsContext = createContext<CmsDocument | null>(null);

/**
 * Path-projected CMS for the active route.
 *
 * Soft navigations do not re-execute <script id="cms-data">, so the document must
 * arrive as a Client Component prop (RSC payload) and be applied here. Otherwise
 * window.__CMS__ stays on the previous page's lean projection and TV/service
 * landings render empty or fallback content.
 */
export function CmsBoundary({ payload, children }: { payload: string; children: ReactNode }) {
  const document = useMemo(() => JSON.parse(payload) as CmsDocument, [payload]);

  if (typeof window !== "undefined" && window.__CMS__ !== document) {
    window.__CMS__ = document;
  }

  useLayoutEffect(() => {
    window.__CMS__ = document;
    notifyPublished();
  }, [document]);

  return <CmsContext.Provider value={document}>{children}</CmsContext.Provider>;
}
