import { handleContentPut } from "@/lib/cms/http";
import { localEnv } from "@/lib/cms/local-env";

export const dynamic = "force-dynamic";

export function PUT(request: Request) {
  return handleContentPut(request, localEnv());
}
