import { applyLiveGoogleRating } from "@/lib/google-place-rating";
import { CmsUnavailableError } from "./errors";
import type { CmsDocument, CmsEnv } from "./types";
import { inspectMedia, mediaKey, publicMediaPath, validateDocument } from "./validate";

const READ_ONLY = "This environment is read-only. Production content was not changed.";

export async function loadDocument(env: CmsEnv): Promise<CmsDocument> {
  return applyLiveGoogleRating(await readStoredDocument(env));
}

function prepareStored(raw: unknown) {
  return validateDocument(raw);
}

async function readStoredDocument(env: CmsEnv): Promise<CmsDocument> {
  if (env.CMS_DB) {
    const row = await env.CMS_DB.prepare("SELECT body FROM documents WHERE id = ?")
      .bind("site")
      .first<{ body: string }>();
    if (!row?.body) throw new CmsUnavailableError("The CMS document is missing from the database.");
    return prepareStored(JSON.parse(row.body));
  }
  if (env.readLocal) return prepareStored(await env.readLocal());
  throw new CmsUnavailableError("Content storage is not configured.");
}

export async function saveDocument(env: CmsEnv, input: unknown) {
  if (env.readOnly) throw new Error(READ_ONLY);
  const document = validateDocument(input);
  const body = JSON.stringify(document);
  if (env.CMS_DB) {
    await env.CMS_DB.prepare(
      "INSERT INTO documents (id, body, updated_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET body = excluded.body, updated_at = excluded.updated_at",
    )
      .bind("site", body, new Date().toISOString())
      .run();
  }
  if (!env.CMS_DB) throw new Error("Content storage is not configured.");
  return document;
}

export async function storeImage(env: CmsEnv, key: string, bytes: Uint8Array, type: string) {
  if (env.readOnly) throw new Error(READ_ONLY);
  if (env.CMS_MEDIA) {
    await env.CMS_MEDIA.put(key, bytes, { httpMetadata: { contentType: type } });
    return;
  }
  if (env.CMS_MEDIA_KV) {
    await env.CMS_MEDIA_KV.put(key, bytes, { metadata: { contentType: type } });
    return;
  }
  throw new Error("Image storage is not configured.");
}

export async function loadImage(env: CmsEnv, key: string) {
  if (env.CMS_MEDIA) {
    const object = await env.CMS_MEDIA.get(key);
    if (!object) return null;
    const bytes = object.arrayBuffer ? new Uint8Array(await object.arrayBuffer()) : null;
    const resolved = bytes ?? (object.body ? new Uint8Array(await new Response(object.body).arrayBuffer()) : null);
    if (!resolved) return null;
    return { bytes: resolved, type: object.httpMetadata?.contentType || "application/octet-stream" };
  }
  if (env.CMS_MEDIA_KV) {
    const stored = await env.CMS_MEDIA_KV.getWithMetadata(key, { type: "arrayBuffer" });
    if (!stored.value) return null;
    return {
      bytes: new Uint8Array(stored.value),
      type: stored.metadata?.contentType || "application/octet-stream",
    };
  }
  return null;
}

export async function discardImage(env: CmsEnv, key: string) {
  if (env.readOnly) throw new Error(READ_ONLY);
  if (env.CMS_MEDIA) await env.CMS_MEDIA.delete(key);
  if (env.CMS_MEDIA_KV) await env.CMS_MEDIA_KV.delete(key);
  if (!env.CMS_MEDIA && !env.CMS_MEDIA_KV) {
    throw new Error("Image storage is not configured.");
  }
}

export async function saveMedia(env: CmsEnv, file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const image = inspectMedia(bytes, file.type);
  const key = `uploads/${crypto.randomUUID()}.${image.extension}`;
  await storeImage(env, key, bytes, image.type);
  return { key, src: publicMediaPath(key), type: image.type };
}

export async function readMedia(env: CmsEnv, key: string) {
  return loadImage(env, mediaKey(key));
}

export async function listMedia(env: CmsEnv) {
  if (env.CMS_MEDIA?.list) {
    const items: { key: string; src: string }[] = [];
    let cursor: string | undefined;
    do {
      const page = await env.CMS_MEDIA.list({ prefix: "uploads/", cursor });
      for (const object of page.objects ?? []) {
        try {
          const key = mediaKey(object.key);
          items.push({ key, src: publicMediaPath(key) });
        } catch {
          void 0;
        }
      }
      cursor = page.truncated ? page.cursor : undefined;
    } while (cursor && items.length < 500);
    return items;
  }
  if (env.CMS_MEDIA_KV) {
    const items: { key: string; src: string }[] = [];
    let cursor: string | undefined;
    do {
      const page = await env.CMS_MEDIA_KV.list({ prefix: "uploads/", cursor });
      for (const object of page.keys ?? []) {
        try {
          const key = mediaKey(object.name);
          items.push({ key, src: publicMediaPath(key) });
        } catch {
          void 0;
        }
      }
      cursor = page.list_complete ? undefined : page.cursor;
    } while (cursor && items.length < 500);
    return items;
  }
  return [];
}

export async function removeMedia(env: CmsEnv, key: string) {
  await discardImage(env, mediaKey(key));
}
