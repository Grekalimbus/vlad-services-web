import { handleMediaGet } from "../../../src/lib/cms/http";
import type { CmsEnv } from "../../../src/lib/cms/types";

export function onRequestGet(context: { env: CmsEnv; params: { path?: string[] } }) {
  return handleMediaGet(context.env, (context.params.path ?? []).join("/"));
}
