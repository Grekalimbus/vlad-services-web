import { handleContentPut } from "../../../src/lib/cms/http";
import type { CmsEnv } from "../../../src/lib/cms/types";

export function onRequestPut(context: { request: Request; env: CmsEnv }) {
  return handleContentPut(context.request, context.env);
}
