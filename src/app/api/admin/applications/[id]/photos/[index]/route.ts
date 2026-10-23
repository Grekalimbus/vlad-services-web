import { handleApplicationPhoto } from "@/lib/applications";
import { localEnv } from "@/lib/cms/local-env";

export const dynamic = "force-dynamic";

export function GET(request: Request, context: { params: Promise<{ id: string; index: string }> }) {
  return context.params.then((params) => handleApplicationPhoto(request, localEnv(), params.id, params.index));
}
