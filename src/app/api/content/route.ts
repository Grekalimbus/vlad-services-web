import { handleContentGet } from "@/lib/cms/http";
import { getCmsEnv } from "@/lib/cms/runtime";

export const dynamic = "force-dynamic";

export async function GET() {
  return handleContentGet(await getCmsEnv());
}
