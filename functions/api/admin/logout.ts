import { handleLogout } from "../../../src/lib/cms/http";

export function onRequestPost(context: { request: Request }) {
  return handleLogout(context.request);
}
