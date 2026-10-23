import { handleMediaDelete, handleMediaList, handleMediaPost } from "../../../src/lib/cms/http";
import type { CmsEnv } from "../../../src/lib/cms/types";

type Context = { request: Request; env: CmsEnv };

export function onRequestGet(context: Context) {
  return handleMediaList(context.request, context.env);
}

export function onRequestPost(context: Context) {
  return handleMediaPost(context.request, context.env);
}

export function onRequestDelete(context: Context) {
  return handleMediaDelete(context.request, context.env);
}
