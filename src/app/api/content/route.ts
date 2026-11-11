import { applySecurityHeaders } from "@/lib/form-guard";
import { loadCms } from "@/lib/cms/load";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const document = await loadCms();
    const headers = new Headers({
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    });
    applySecurityHeaders(headers);
    return new Response(JSON.stringify(document), { status: 200, headers });
  } catch {
    const headers = new Headers({
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    });
    applySecurityHeaders(headers);
    return new Response(JSON.stringify({ error: "Could not load content." }), { status: 500, headers });
  }
}
