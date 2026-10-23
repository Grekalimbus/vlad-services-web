import { handleApplicationPost } from "../../src/lib/applications";
import type { CmsEnv } from "../../src/lib/cms/types";

export function onRequestPost(context: { request: Request; env: CmsEnv }) {
  return handleApplicationPost(context.request, context.env);
}
