"use client";

import { useContext, useSyncExternalStore } from "react";
import { CmsContext } from "./boundary";
import { CmsUnavailableError } from "./errors";
import { isEditing, peekOverride, subscribe } from "./edit-store";
import type { CmsDocument } from "./types";

export function useCms(): CmsDocument {
  const provided = useContext(CmsContext);
  const override = useSyncExternalStore(subscribe, peekOverride, () => null);
  if (override) return override;
  if (provided) return provided;
  throw new CmsUnavailableError("CMS content is not loaded for this request.");
}

export function useEditing() {
  return useSyncExternalStore(subscribe, isEditing, () => false);
}
