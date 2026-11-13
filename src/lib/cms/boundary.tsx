"use client";

import { createContext, useLayoutEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { notifyPublished, peekDraft, peekOverride, subscribe } from "./edit-store";
import type { CmsDocument } from "./types";

export const CmsContext = createContext<CmsDocument | null>(null);

/**
 * The server payload is the document for this page. Editor drafts can replace
 * it in memory; nothing here refetches or merges another copy over the HTML.
 */
export function CmsBoundary({ payload, children }: { payload: string; children: ReactNode }) {
  const published = useMemo(() => JSON.parse(payload) as CmsDocument, [payload]);
  const override = useSyncExternalStore(subscribe, peekOverride, () => null);
  const document = override ?? published;
  useLayoutEffect(() => {
    if (peekDraft()) return;
    notifyPublished();
  }, [document]);
  return <CmsContext.Provider value={document}>{children}</CmsContext.Provider>;
}
