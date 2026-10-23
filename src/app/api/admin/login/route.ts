import { handleLogin } from "@/lib/cms/http";
import { localEnv } from "@/lib/cms/local-env";

export const dynamic = "force-dynamic";

export function POST(request: Request) {
  return handleLogin(request, localEnv());
}
