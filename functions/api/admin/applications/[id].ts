import { handleApplicationDelete, handleApplicationUpdate } from "../../../../src/lib/applications";
import type { CmsEnv } from "../../../../src/lib/cms/types";

export function onRequestPatch(context: { request: Request; env: CmsEnv; params: { id?: string } }) {
  return handleApplicationUpdate(context.request, context.env, context.params.id ?? "");
}

export function onRequestDelete(context: { request: Request; env: CmsEnv; params: { id?: string } }) {
  return handleApplicationDelete(context.request, context.env, context.params.id ?? "");
}
