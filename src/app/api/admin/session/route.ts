import { handleSession } from "@/lib/cms/http";
import { localEnv } from "@/lib/cms/local-env";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  return handleSession(request, localEnv());
}
