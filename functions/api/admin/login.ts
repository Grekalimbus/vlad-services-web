import { handleLogin } from "../../../src/lib/cms/http";
import type { CmsEnv } from "../../../src/lib/cms/types";

export function onRequestPost(context: { request: Request; env: CmsEnv }) {
  return handleLogin(context.request, context.env);
}
