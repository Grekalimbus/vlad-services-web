import { peekDraft } from "./edit-store";
import defaultDocument from "./default-document.json";
import type { CmsDocument } from "./types";

export const fallbackDocument = defaultDocument as CmsDocument;

type CmsStore = { getStore?: () => CmsDocument | undefined };
type CmsSlot = { get?: () => { current: CmsDocument | null } };

function requestDocument() {
  const store = (globalThis as typeof globalThis & { __CMS_ALS?: CmsStore }).__CMS_ALS;
  return store?.getStore?.() ?? null;
}

function rememberedDocument() {
  const slot = (globalThis as typeof globalThis & { __CMS_SLOT?: CmsSlot }).__CMS_SLOT;
  return slot?.get?.()?.current ?? null;
}

export function readPublished(): CmsDocument {
  if (typeof window !== "undefined" && window.__CMS__) return window.__CMS__;
  return rememberedDocument() ?? requestDocument() ?? fallbackDocument;
}

export function readCms(): CmsDocument {
  if (typeof window !== "undefined") {
    const draft = peekDraft();
    if (draft) return draft;
  }
  return readPublished();
}

export function live<T extends object>(select: () => T): T {
  return new Proxy({} as T, {
    get(_target, property) {
      const value = select() as Record<PropertyKey, unknown>;
      const result = value[property];
      return typeof result === "function" ? result.bind(value) : result;
    },
    has(_target, property) {
      return property in select();
    },
    ownKeys() {
      return Reflect.ownKeys(select() as object);
    },
    getOwnPropertyDescriptor(_target, property) {
      const descriptor = Object.getOwnPropertyDescriptor(select(), property);
      if (!descriptor) return undefined;
      return { ...descriptor, configurable: true };
    },
  });
}

export function getPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((value, key) => {
    if (value == null || typeof value !== "object") return undefined;
    return (value as Record<string, unknown>)[key];
  }, source);
}

declare global {
  interface Window {
    __CMS__?: CmsDocument;
  }
}
