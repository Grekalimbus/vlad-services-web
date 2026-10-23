import type { ReactNode } from "react";
import { CmsBoundary } from "./boundary";
import { loadCms } from "./load";

export async function CmsPage({ children }: { children: ReactNode }) {
  const document = await loadCms();
  return <CmsBoundary document={document}>{children}</CmsBoundary>;
}
