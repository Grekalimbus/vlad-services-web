"use client";

import { useContext, useSyncExternalStore } from "react";
import { CmsContext } from "./boundary";
import { isEditing, peekOverride, subscribe } from "./edit-store";
import { readPublished } from "./read";
import type { CmsDocument } from "./types";

function noOverride(): CmsDocument | null {
  return null;
}

export function useCms(): CmsDocument {
  const provided = useContext(CmsContext);
  const override = useSyncExternalStore(subscribe, peekOverride, noOverride);
  return override ?? provided ?? readPublished();
}

export function useEditing() {
  return useSyncExternalStore(subscribe, isEditing, () => false);
}
