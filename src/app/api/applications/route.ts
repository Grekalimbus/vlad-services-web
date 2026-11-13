import { handleApplicationPost } from "@/lib/applications";
import { getCmsEnv } from "@/lib/cms/runtime";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleApplicationPost(request, await getCmsEnv());
}
