"use client";

import type { ReactNode } from "react";
import { QuoteProvider } from "@/components/quote-provider";
import { QuoteDialog } from "@/components/quote-dialog";
import { MobileCta } from "@/components/mobile-cta";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QuoteProvider>
      {children}
      <QuoteDialog />
      <MobileCta />
    </QuoteProvider>
  );
}
