import { handleMediaGet } from "@/lib/cms/http";
import { getCmsEnv } from "@/lib/cms/runtime";
import { mediaKey } from "@/lib/cms/validate";
import { PRODUCTION_ORIGIN } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ key: string[] }> }) {
  const params = await context.params;
  const key = params.key.join("/");
  const env = await getCmsEnv();
  const stored = await handleMediaGet(env, key);
  const allowProductionRead =
    env.readOnly || env.mediaReadonly || env.CMS_MEDIA_READONLY === "1" || process.env.CMS_RUNTIME !== "cloudflare";
  if (stored.status !== 404 || !allowProductionRead) return stored;
  try {
    const remote = await fetch(`${PRODUCTION_ORIGIN}/api/media/${mediaKey(key)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!remote.ok) return stored;
    return new Response(await remote.arrayBuffer(), {
      headers: {
        "content-type": remote.headers.get("content-type") || "application/octet-stream",
        "x-content-type-options": "nosniff",
        "cache-control": "private, max-age=300",
      },
    });
  } catch {
    return stored;
  }
}
