import { handleLogout } from "../../../src/lib/cms/http";

export function onRequestPost() {
  return handleLogout();
}
