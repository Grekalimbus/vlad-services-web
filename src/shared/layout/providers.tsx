"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { QuoteDialog, QuoteProvider } from "@/features/quote";
import { MobileCta } from "./mobile-cta";

const VisualEditor = dynamic(() => import("@/features/editor/visual-editor").then((mod) => mod.VisualEditor), {
  ssr: false,
});

export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const admin = pathname.startsWith("/admin");
  return (
    <QuoteProvider>
      {children}
      {admin ? null : <QuoteDialog />}
      {admin ? null : <MobileCta />}
      <VisualEditor />
    </QuoteProvider>
  );
}
