import { handleApplicationPost } from "@/lib/applications";
import { localEnv } from "@/lib/cms/local-env";

export const dynamic = "force-dynamic";

export function POST(request: Request) {
  return handleApplicationPost(request, localEnv());
}
