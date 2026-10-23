import { fallbackDocument } from "./read";
import type { CmsDocument, CmsEnv } from "./types";
import { inspectImage, mediaKey, publicMediaPath, validateDocument } from "./validate";

export async function loadDocument(env: CmsEnv): Promise<CmsDocument> {
  if (env.CMS_DB) {
    const row = await env.CMS_DB.prepare("SELECT body FROM documents WHERE id = ?")
      .bind("site")
      .first<{ body: string }>();
    if (row?.body) return validateDocument(JSON.parse(row.body));
  }
  if (env.readLocal) {
    try {
      return validateDocument(await env.readLocal());
    } catch {
      return structuredClone(fallbackDocument);
    }
  }
  return structuredClone(fallbackDocument);
}

export async function saveDocument(env: CmsEnv, input: unknown) {
  const document = validateDocument(input);
  const body = JSON.stringify(document);
  if (env.CMS_DB) {
    await env.CMS_DB.prepare(
      "INSERT INTO documents (id, body, updated_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET body = excluded.body, updated_at = excluded.updated_at",
    )
      .bind("site", body, new Date().toISOString())
      .run();
  }
  if (env.writeLocal) await env.writeLocal(document);
  if (!env.CMS_DB && !env.writeLocal) throw new Error("Content storage is not configured.");
  return document;
}

export async function saveMedia(env: CmsEnv, file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const image = inspectImage(bytes, file.type);
  const key = `uploads/${crypto.randomUUID()}.${image.extension}`;
  if (env.CMS_MEDIA) {
    await env.CMS_MEDIA.put(key, bytes, { httpMetadata: { contentType: image.type } });
  } else if (env.putMedia) {
    await env.putMedia(key, bytes, image.type);
  } else {
    throw new Error("Image storage is not configured.");
  }
  return { key, src: publicMediaPath(key), type: image.type };
}

export async function readMedia(env: CmsEnv, key: string) {
  const safeKey = mediaKey(key);
  if (env.CMS_MEDIA) {
    const object = await env.CMS_MEDIA.get(safeKey);
    if (!object) return null;
    const bytes = object.arrayBuffer ? new Uint8Array(await object.arrayBuffer()) : null;
    if (!bytes && object.body) {
      const buffer = await new Response(object.body).arrayBuffer();
      return { bytes: new Uint8Array(buffer), type: object.httpMetadata?.contentType || "application/octet-stream" };
    }
    if (!bytes) return null;
    return { bytes, type: object.httpMetadata?.contentType || "application/octet-stream" };
  }
  if (env.getMedia) return env.getMedia(safeKey);
  return null;
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
          // Skip objects that are not public image uploads.
        }
      }
      cursor = page.truncated ? page.cursor : undefined;
    } while (cursor && items.length < 500);
    return items;
  }
  if (env.listMedia) return env.listMedia();
  return [];
}

export async function removeMedia(env: CmsEnv, key: string) {
  const safeKey = mediaKey(key);
  if (env.CMS_MEDIA) await env.CMS_MEDIA.delete(safeKey);
  if (env.deleteMedia) await env.deleteMedia(safeKey);
  if (!env.CMS_MEDIA && !env.deleteMedia) throw new Error("Image storage is not configured.");
}
