import { handleContentPut } from "@/lib/cms/http";
import { getCmsEnv } from "@/lib/cms/runtime";

export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  return handleContentPut(request, await getCmsEnv());
}
