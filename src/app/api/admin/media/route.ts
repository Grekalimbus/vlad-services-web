import { handleMediaDelete, handleMediaList, handleMediaPost } from "@/lib/cms/http";
import { localEnv } from "@/lib/cms/local-env";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  return handleMediaList(request, localEnv());
}

export function POST(request: Request) {
  return handleMediaPost(request, localEnv());
}

export function DELETE(request: Request) {
  return handleMediaDelete(request, localEnv());
}
