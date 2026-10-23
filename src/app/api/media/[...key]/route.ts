import { handleMediaGet } from "@/lib/cms/http";
import { localEnv } from "@/lib/cms/local-env";

export const dynamic = "force-dynamic";

export function GET(_request: Request, context: { params: Promise<{ key: string[] }> }) {
  return context.params.then((params) => handleMediaGet(localEnv(), params.key.join("/")));
}
