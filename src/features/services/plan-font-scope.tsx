import type { ReactNode } from "react";
import { planFontVariables } from "./plan-fonts";

export function PlanFontScope({ children }: { children: ReactNode }) {
  return <div className={planFontVariables}>{children}</div>;
}
