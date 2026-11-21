import { handleMediaGet, mediaBytesResponse } from "@/lib/cms/http";
import { getCmsEnv } from "@/lib/cms/runtime";
import { mediaKey } from "@/lib/cms/validate";
import { PRODUCTION_ORIGIN } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ key: string[] }> }) {
  const params = await context.params;
  const key = params.key.join("/");
  const env = await getCmsEnv();
  const stored = await handleMediaGet(request, env, key);
  const allowProductionRead =
    env.readOnly || env.mediaReadonly || env.CMS_MEDIA_READONLY === "1" || process.env.CMS_RUNTIME !== "cloudflare";
  if (stored.status !== 404 || !allowProductionRead) return stored;
  try {
    const headers = new Headers();
    const range = request.headers.get("range");
    if (range) headers.set("range", range);
    const remote = await fetch(`${PRODUCTION_ORIGIN}/api/media/${mediaKey(key)}`, {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(30000),
    });
    if (remote.status === 206 || remote.status === 416) return passMedia(remote);
    if (!remote.ok) return stored;
    return mediaBytesResponse(
      request,
      new Uint8Array(await remote.arrayBuffer()),
      remote.headers.get("content-type") || "application/octet-stream",
    );
  } catch {
    return stored;
  }
}

function passMedia(remote: Response) {
  const headers = new Headers();
  for (const name of ["content-type", "content-range", "content-length", "accept-ranges", "cache-control"]) {
    const value = remote.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set("x-content-type-options", "nosniff");
  return new Response(remote.status === 416 ? null : remote.body, { status: remote.status, headers });
}
