import { handleLogout } from "@/lib/cms/http";

export const dynamic = "force-dynamic";

export function POST() {
  return handleLogout();
}
