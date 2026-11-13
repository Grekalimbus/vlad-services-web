import { handleMediaDelete, handleMediaList, handleMediaPost } from "@/lib/cms/http";
import { getCmsEnv } from "@/lib/cms/runtime";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleMediaList(request, await getCmsEnv());
}

export async function POST(request: Request) {
  return handleMediaPost(request, await getCmsEnv());
}

export async function DELETE(request: Request) {
  return handleMediaDelete(request, await getCmsEnv());
}
