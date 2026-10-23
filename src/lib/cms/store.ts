import { cache } from "react";
import { AsyncLocalStorage } from "node:async_hooks";
import type { CmsDocument } from "./types";

const storage = new AsyncLocalStorage<CmsDocument>();
const requestSlot = cache(() => ({ current: null as CmsDocument | null }));

type CmsGlobals = typeof globalThis & {
  __CMS_ALS?: AsyncLocalStorage<CmsDocument>;
  __CMS_SLOT?: { get: () => { current: CmsDocument | null } };
};

const globals = globalThis as CmsGlobals;
globals.__CMS_ALS = storage;
globals.__CMS_SLOT = { get: () => requestSlot() };

export function rememberCms(document: CmsDocument) {
  requestSlot().current = document;
  storage.enterWith(document);
}
