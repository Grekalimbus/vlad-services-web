import { handleApplicationList } from "../../../src/lib/applications";
import type { CmsEnv } from "../../../src/lib/cms/types";

export function onRequestGet(context: { request: Request; env: CmsEnv }) {
  return handleApplicationList(context.request, context.env);
}
