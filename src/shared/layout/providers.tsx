"use client";

import type { ReactNode } from "react";
import { QuoteDialog, QuoteProvider } from "@/features/quote";
import { MobileCta } from "./mobile-cta";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QuoteProvider>
      {children}
      <QuoteDialog />
      <MobileCta />
    </QuoteProvider>
  );
}
