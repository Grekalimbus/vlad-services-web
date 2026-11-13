import { handleSession } from "@/lib/cms/http";
import { getCmsEnv } from "@/lib/cms/runtime";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleSession(request, await getCmsEnv());
}
