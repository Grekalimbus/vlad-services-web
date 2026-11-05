"use client";

import { createContext, type ReactNode } from "react";
import { readPublished } from "./read";
import type { CmsDocument } from "./types";

export const CmsContext = createContext<CmsDocument | null>(null);

/**
 * Seeds CMS context without accepting the document as a Client Component prop.
 * That avoids serializing the full CMS payload a second time into the RSC flight
 * (it is already available via window.__CMS__ / request ALS).
 */
export function CmsBoundary({ children }: { children: ReactNode }) {
  return <CmsContext.Provider value={readPublished()}>{children}</CmsContext.Provider>;
}
