import { cache } from "react";
import { loadDocument } from "./content-store";
import { getCmsEnv } from "./runtime";
import type { CmsDocument } from "./types";

/** The CMS document for this request. React cache() keeps it on this request only. */
export const loadCms = cache(async (): Promise<CmsDocument> => loadDocument(await getCmsEnv()));

export async function bindCms(): Promise<CmsDocument> {
  return loadCms();
}
