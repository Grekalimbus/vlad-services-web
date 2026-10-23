import { handleContentGet } from "@/lib/cms/http";
import { localEnv } from "@/lib/cms/local-env";

export const dynamic = "force-dynamic";

export function GET() {
  return handleContentGet(localEnv());
}
