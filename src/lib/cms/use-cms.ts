"use client";

import { useContext, useSyncExternalStore } from "react";
import { CmsContext } from "./boundary";
import { isEditing, peekOverride, subscribe } from "./edit-store";
import { readPublished } from "./read";
import type { CmsDocument } from "./types";

function noOverride(): CmsDocument | null {
  return null;
}

function publishedSnapshot(): CmsDocument | null {
  return typeof window === "undefined" ? null : (window.__CMS__ ?? null);
}

export function useCms(): CmsDocument {
  const provided = useContext(CmsContext);
  const override = useSyncExternalStore(subscribe, peekOverride, noOverride);
  const published = useSyncExternalStore(subscribe, publishedSnapshot, noOverride);
  return override ?? published ?? provided ?? readPublished();
}

export function useEditing() {
  return useSyncExternalStore(subscribe, isEditing, () => false);
}
