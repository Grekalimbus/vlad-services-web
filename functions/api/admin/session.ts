import { handleSession } from "../../../src/lib/cms/http";
import type { CmsEnv } from "../../../src/lib/cms/types";

export function onRequestGet(context: { request: Request; env: CmsEnv }) {
  return handleSession(context.request, context.env);
}
