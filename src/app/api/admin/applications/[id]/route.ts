import { handleApplicationDelete, handleApplicationUpdate } from "@/lib/applications";
import { localEnv } from "@/lib/cms/local-env";

export const dynamic = "force-dynamic";

export function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  return context.params.then((params) => handleApplicationUpdate(request, localEnv(), params.id));
}

export function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  return context.params.then((params) => handleApplicationDelete(request, localEnv(), params.id));
}
