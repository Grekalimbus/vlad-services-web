import { isAuthorized, login, logout } from "./auth";
import { listMedia, loadDocument, readMedia, removeMedia, saveDocument, saveMedia } from "./content-store";
import type { CmsEnv } from "./types";

export async function handleContentGet(env: CmsEnv) {
  try {
    return json(await loadDocument(env));
  } catch (error) {
    return json({ error: message(error) }, 500);
  }
}

export async function handleContentPut(request: Request, env: CmsEnv) {
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
  } catch (error) {
    return json({ error: message(error) }, 500);
  }
}

export async function handleMediaDelete(request: Request, env: CmsEnv) {
  if (!(await isAuthorized(request, env))) return json({ error: "Unauthorized" }, 401);
  try {
    const key = new URL(request.url).searchParams.get("key") ?? "";
    await removeMedia(env, key);
    return json({ ok: true });
  } catch (error) {
    return json({ error: message(error) }, 400);
  }
}

export async function handleMediaGet(env: CmsEnv, key: string) {
  try {
    const media = await readMedia(env, key);
    if (!media) return new Response("Not found", { status: 404 });
    const bytes = Uint8Array.from(media.bytes);
    return new Response(bytes, {
      headers: {
        "content-type": media.type,
        "x-content-type-options": "nosniff",
        "content-security-policy": "default-src 'none'; sandbox",
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

function message(error: unknown) {
  return error instanceof Error ? error.message : "Request failed.";
}
