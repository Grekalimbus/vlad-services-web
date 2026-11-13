import { handleLogin } from "@/lib/cms/http";
import { getCmsEnv } from "@/lib/cms/runtime";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleLogin(request, await getCmsEnv());
}
