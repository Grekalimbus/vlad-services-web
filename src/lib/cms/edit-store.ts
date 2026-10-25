import type { CmsDocument } from "./types";

let draft: CmsDocument | null = null;
let adopted: CmsDocument | null = null;
let editing = false;
const listeners = new Set<() => void>();

export function peekDraft() {
  return draft;
}

export function peekOverride() {
  return draft ?? adopted;
}

export function isEditing() {
  return editing;
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function setEditing(value: boolean) {
  if (editing === value) return;
  editing = value;
  if (!value) draft = null;
  emit();
}

export function updateDraft(mutator: (document: CmsDocument) => void) {
  const source = draft ?? (typeof window !== "undefined" ? window.__CMS__ : null);
  if (!source) return;
  const next = structuredClone(source);
  mutator(next);
  draft = next;
  emit();
}

export function setAt(path: string, value: unknown) {
  updateDraft((document) => {
    const keys = path.split(".");
    let cursor = document as unknown as Record<string, unknown>;
    for (let index = 0; index < keys.length - 1; index += 1) {
      const key = keys[index];
      const current = cursor[key];
      if (current == null || typeof current !== "object") {
        cursor[key] = /^\d+$/.test(keys[index + 1] ?? "") ? [] : {};
      }
      cursor = cursor[key] as Record<string, unknown>;
    }
    cursor[keys[keys.length - 1]] = value;
  });
}

export function discardDraft() {
  if (!draft) return;
  draft = null;
  emit();
}

export function adoptSaved(document: CmsDocument) {
  if (typeof window !== "undefined") window.__CMS__ = document;
  adopted = document;
  draft = null;
  emit();
}

/** Replace the build-time snapshot with the document stored in the database. */
export function publishDocument(document: CmsDocument) {
  if (draft) return;
  if (typeof window !== "undefined") window.__CMS__ = document;
  adopted = document;
  emit();
}

export function isDirty() {
  if (!draft || typeof window === "undefined" || !window.__CMS__) return false;
  return JSON.stringify(draft) !== JSON.stringify(window.__CMS__);
}
