import { isAuthorized, login, logout } from "./auth";
import { listMedia, loadDocument, readMedia, removeMedia, saveDocument, saveMedia } from "./content-store";
import { applySecurityHeaders, sameOrigin } from "../form-guard";
import { mediaKey } from "./validate";
import type { CmsEnv } from "./types";

export async function handleContentGet(env: CmsEnv) {
  try {
    return json(await loadDocument(env));
  } catch {
    return json({ error: "Could not load content." }, 500);
  }
}

export async function handleContentPut(request: Request, env: CmsEnv) {
  if (!sameOrigin(request)) return json({ error: "Request was rejected." }, 403);
  if (!(await isAuthorized(request, env))) return json({ error: "Unauthorized" }, 401);
  try {
    const document = await saveDocument(env, await request.json());
    return json(document);
  } catch (error) {
    return json({ error: message(error) }, 400);
  }
}

export async function handleLogin(request: Request, env: CmsEnv) {
  return login(request, env);
}

export function handleLogout(request: Request) {
  return logout(request);
}

export async function handleSession(request: Request, env: CmsEnv) {
  return json({ authenticated: await isAuthorized(request, env) });
}

export async function handleMediaPost(request: Request, env: CmsEnv) {
  if (!sameOrigin(request)) return json({ error: "Request was rejected." }, 403);
  if (!(await isAuthorized(request, env))) return json({ error: "Unauthorized" }, 401);
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return json({ error: "Choose an image." }, 400);
    return json(await saveMedia(env, file));
  } catch (error) {
    return json({ error: message(error) }, 400);
  }
}

export async function handleMediaList(request: Request, env: CmsEnv) {
  if (!(await isAuthorized(request, env))) return json({ error: "Unauthorized" }, 401);
  try {
    return json({ items: await listMedia(env) });
  } catch {
    return json({ error: "Could not load media." }, 500);
  }
}

export async function handleMediaDelete(request: Request, env: CmsEnv) {
  if (!sameOrigin(request)) return json({ error: "Request was rejected." }, 403);
  if (!(await isAuthorized(request, env))) return json({ error: "Unauthorized" }, 401);
  try {
    const key = new URL(request.url).searchParams.get("key") ?? "";
    await removeMedia(env, key);
    return json({ ok: true });
  } catch (error) {
    return json({ error: message(error) }, 400);
  }
}

export async function handleMediaGet(request: Request, env: CmsEnv, key: string) {
  try {
    const rangeHeader = request.headers.get("range");
    if (rangeHeader && env.CMS_MEDIA?.head) {
      const ranged = await rangedMediaResponse(env, key, rangeHeader);
      if (ranged) return ranged;
    }
    const media = await readMedia(env, key);
    if (!media) return new Response("Not found", { status: 404 });
    return mediaBytesResponse(request, Uint8Array.from(media.bytes), media.type);
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

/** iOS will not play a video unless the file can be fetched in byte ranges. */
export function mediaBytesResponse(request: Request, bytes: Uint8Array, type: string) {
  const total = bytes.byteLength;
  const parsed = parseByteRange(request.headers.get("range"), total);
  if (parsed === "unsatisfiable") return unsatisfiableRange(type, total);
  if (!parsed) return fullMediaResponse(bytes, type);
  const body = bytes.slice(parsed.start, parsed.end + 1);
  return partialMediaResponse(body, type, parsed.start, parsed.end, total);
}

function fullMediaResponse(body: BodyInit, type: string) {
  const headers = mediaHeaders(type);
  if (body instanceof Uint8Array) headers.set("content-length", String(body.byteLength));
  return new Response(body, { status: 200, headers });
}

function partialMediaResponse(body: BodyInit, type: string, start: number, end: number, total: number) {
  const headers = mediaHeaders(type);
  headers.set("content-range", `bytes ${start}-${end}/${total}`);
  const length = end - start + 1;
  headers.set("content-length", String(length));
  return new Response(body, { status: 206, headers });
}

function unsatisfiableRange(type: string, total: number) {
  const headers = mediaHeaders(type);
  headers.set("content-range", `bytes */${total}`);
  return new Response(null, { status: 416, headers });
}

function mediaHeaders(type: string) {
  return new Headers({
    "content-type": type || "application/octet-stream",
    "accept-ranges": "bytes",
    "x-content-type-options": "nosniff",
    "content-security-policy": "default-src 'none'; sandbox",
    "cache-control": "public, max-age=31536000, immutable",
  });
}

async function rangedMediaResponse(env: CmsEnv, key: string, rangeHeader: string) {
  const bucket = env.CMS_MEDIA;
  if (!bucket?.head) return null;
  const safeKey = mediaKey(key);
  const head = await bucket.head(safeKey);
  if (!head) return new Response("Not found", { status: 404 });
  const total = head.size;
  const type = head.httpMetadata?.contentType || "application/octet-stream";
  const parsed = parseByteRange(rangeHeader, total);
  if (parsed === "unsatisfiable") return unsatisfiableRange(type, total);
  if (!parsed) return null;
  const length = parsed.end - parsed.start + 1;
  const object = await bucket.get(safeKey, { range: { offset: parsed.start, length } });
  if (!object?.body) return new Response("Not found", { status: 404 });
  const resolvedType = object.httpMetadata?.contentType || type;
  const actual = object.range;
  if (!actual || actual.offset == null || actual.length == null) {
    const bytes = new Uint8Array(await new Response(object.body).arrayBuffer());
    return mediaBytesResponse(requestFromRange(rangeHeader), bytes, resolvedType);
  }
  const start = actual.offset;
  const end = actual.offset + actual.length - 1;
  return partialMediaResponse(object.body, resolvedType, start, end, object.size || total);
}

function requestFromRange(rangeHeader: string) {
  return new Request("https://media.local/", { headers: { range: rangeHeader } });
}

function parseByteRange(header: string | null, total: number) {
  if (!header || total < 0) return null;
  const match = /^bytes=(\d*)-(\d*)$/i.exec(header.trim().split(",")[0]?.trim() ?? "");
  if (!match) return null;
  if (total === 0) return "unsatisfiable" as const;
  const startText = match[1] ?? "";
  const endText = match[2] ?? "";
  if (!startText && !endText) return "unsatisfiable" as const;
  if (!startText) {
    const suffix = Number(endText);
    if (!Number.isFinite(suffix) || suffix <= 0) return "unsatisfiable" as const;
    const length = Math.min(suffix, total);
    return { start: total - length, end: total - 1 };
  }
  const start = Number(startText);
  if (!Number.isFinite(start) || start < 0 || start >= total) return "unsatisfiable" as const;
  let end = endText ? Number(endText) : total - 1;
  if (!Number.isFinite(end) || end < start) return "unsatisfiable" as const;
  if (end >= total) end = total - 1;
  return { start, end };
}

function json(body: unknown, status = 200) {
  const headers = new Headers({
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  applySecurityHeaders(headers);
  return new Response(JSON.stringify(body), { status, headers });
}

function message(error: unknown) {
  return error instanceof Error ? error.message : "Request failed.";
}
