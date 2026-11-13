import { handleApplicationPhoto } from "@/lib/applications";
import { getCmsEnv } from "@/lib/cms/runtime";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ id: string; index: string }> }) {
  const params = await context.params;
  return handleApplicationPhoto(request, await getCmsEnv(), params.id, params.index);
}
