import { cache } from "react";
import { AsyncLocalStorage } from "node:async_hooks";
import type { CmsDocument } from "./types";

const storage = new AsyncLocalStorage<CmsDocument>();
const requestSlot = cache(() => ({
  current: null as CmsDocument | null,
  full: null as CmsDocument | null,
  publicLocked: false,
}));

type CmsGlobals = typeof globalThis & {
  __CMS_ALS?: AsyncLocalStorage<CmsDocument>;
  __CMS_SLOT?: { get: () => { current: CmsDocument | null } };
};

const globals = globalThis as CmsGlobals;
globals.__CMS_ALS = storage;
globals.__CMS_SLOT = { get: () => requestSlot() };

/** Remember the full CMS document for this request. */
export function rememberCms(document: CmsDocument) {
  const slot = requestSlot();
  slot.full = document;
  if (slot.publicLocked) return;
  slot.current = document;
  storage.enterWith(document);
}

/**
 * Publish the slim public projection into the request slot used by client SSR.
 * Locks so later bindCms() calls cannot replace it with the full document.
 */
export function rememberPublicCms(document: CmsDocument) {
  const slot = requestSlot();
  slot.current = document;
  slot.publicLocked = true;
  storage.enterWith(document);
}
