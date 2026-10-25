import { handleMediaGet } from "@/lib/cms/http";
import { localEnv } from "@/lib/cms/local-env";
import { mediaKey } from "@/lib/cms/validate";
import { PRODUCTION_ORIGIN } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ key: string[] }> }) {
  const params = await context.params;
  const key = params.key.join("/");
  const local = await handleMediaGet(localEnv(), key);
  if (local.status !== 404 || process.env.NODE_ENV !== "development") return local;
  try {
    const remote = await fetch(`${PRODUCTION_ORIGIN}/api/media/${mediaKey(key)}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!remote.ok) return local;
    return new Response(await remote.arrayBuffer(), {
      headers: {
        "content-type": remote.headers.get("content-type") || "application/octet-stream",
        "x-content-type-options": "nosniff",
        "cache-control": "public, max-age=300",
      },
    });
  } catch {
    return local;
  }
}
