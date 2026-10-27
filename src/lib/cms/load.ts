import { cache } from "react";
import { PRODUCTION_ORIGIN } from "@/lib/seo";
import { ensureServiceTemplates } from "@/lib/service-pages";
import { rememberCms } from "./store";
import { fallbackDocument, readCms } from "./read";
import type { CmsDocument } from "./types";
import { withCompanyEmail } from "./content-store";
import { validateDocument } from "./validate";

const PRODUCTION_TTL_MS = 15_000;

let productionCache: { at: number; document: CmsDocument } | null = null;

export const loadCms = cache(async (): Promise<CmsDocument> => {
  return withCompanyEmail(await readSavedDocument());
});

export async function bindCms(): Promise<CmsDocument> {
  const document = await loadCms();
  rememberCms(document);
  return document;
}

async function readSavedDocument(): Promise<CmsDocument> {
  if (process.env.NEXT_PHASE === "phase-production-build" || process.env.STATIC_EXPORT === "true") {
    return ensureServiceTemplates(fallbackDocument);
  }
  if (process.env.NODE_ENV === "development") {
    const remote = await readProductionDocument();
    if (remote) return ensureServiceTemplates(remote);
  }
  try {
    const { readFile } = await import("node:fs/promises");
    const path = await import("node:path");
    const raw = await readFile(path.join(process.cwd(), ".cms", "content.json"), "utf8");
    return ensureServiceTemplates(validateDocument(JSON.parse(raw)));
  } catch {
    return ensureServiceTemplates(readCms());
  }
}

async function readProductionDocument(): Promise<CmsDocument | null> {
  if (process.env.CMS_SOURCE === "local") return null;
  if (productionCache && Date.now() - productionCache.at < PRODUCTION_TTL_MS) {
    return productionCache.document;
  }
  try {
    const response = await fetch(`${PRODUCTION_ORIGIN}/api/content`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return productionCache?.document ?? null;
    const document = validateDocument(await response.json());
    productionCache = { at: Date.now(), document };
    return document;
  } catch {
    return productionCache?.document ?? null;
  }
}
