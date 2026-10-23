"use client";

import { createContext, type ReactNode } from "react";
import type { CmsDocument } from "./types";

export const CmsContext = createContext<CmsDocument | null>(null);

export function CmsBoundary({ document, children }: { document: CmsDocument; children: ReactNode }) {
  return <CmsContext.Provider value={document}>{children}</CmsContext.Provider>;
}
