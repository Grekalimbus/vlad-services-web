import { handleApplicationList } from "@/lib/applications";
import { getCmsEnv } from "@/lib/cms/runtime";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleApplicationList(request, await getCmsEnv());
}
