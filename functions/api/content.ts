import { handleContentGet } from "../../src/lib/cms/http";
import type { CmsEnv } from "../../src/lib/cms/types";

export function onRequestGet(context: { env: CmsEnv }) {
  return handleContentGet(context.env);
}
