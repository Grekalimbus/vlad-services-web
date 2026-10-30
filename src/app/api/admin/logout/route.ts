import { handleLogout } from "@/lib/cms/http";

export const dynamic = "force-dynamic";

export function POST(request: Request) {
  return handleLogout(request);
}
