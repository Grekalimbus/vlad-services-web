import { cache } from "react";
import { rememberCms } from "./store";
import { fallbackDocument, readCms } from "./read";
import type { CmsDocument } from "./types";
import { validateDocument } from "./validate";

export const loadCms = cache(async (): Promise<CmsDocument> => {
  return readSavedDocument();
});

export async function bindCms(): Promise<CmsDocument> {
  const document = await loadCms();
  rememberCms(document);
  return document;
}

async function readSavedDocument(): Promise<CmsDocument> {
  if (process.env.NEXT_PHASE === "phase-production-build" || process.env.STATIC_EXPORT === "true") {
    return fallbackDocument;
  }
  try {
    const { readFile } = await import("node:fs/promises");
    const path = await import("node:path");
    const raw = await readFile(path.join(process.cwd(), ".cms", "content.json"), "utf8");
    return validateDocument(JSON.parse(raw));
  } catch {
    return readCms();
  }
}
