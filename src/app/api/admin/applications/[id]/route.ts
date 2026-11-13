import { handleApplicationDelete, handleApplicationUpdate } from "@/lib/applications";
import { getCmsEnv } from "@/lib/cms/runtime";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  return handleApplicationUpdate(request, await getCmsEnv(), params.id);
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  return handleApplicationDelete(request, await getCmsEnv(), params.id);
}
