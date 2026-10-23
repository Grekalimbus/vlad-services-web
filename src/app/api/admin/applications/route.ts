import { handleApplicationList } from "@/lib/applications";
import { localEnv } from "@/lib/cms/local-env";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  return handleApplicationList(request, localEnv());
}
