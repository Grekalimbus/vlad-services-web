import { handleApplicationPhoto } from "../../../../../../src/lib/applications";
import type { CmsEnv } from "../../../../../../src/lib/cms/types";

export function onRequestGet(context: {
  request: Request;
  env: CmsEnv;
  params: { id?: string; index?: string };
}) {
  return handleApplicationPhoto(context.request, context.env, context.params.id ?? "", context.params.index ?? "");
}
