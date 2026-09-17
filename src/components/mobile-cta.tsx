"use client";

import { Phone } from "lucide-react";
import { CallNow, QuoteCta } from "@/components/cta";
import { ctas } from "@/lib/site";

export function MobileCta() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 lg:hidden">
      <div className="pointer-events-auto border-t border-border bg-background/95 px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-2 gap-2">
          <CallNow className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-3 text-[0.75rem] font-medium tracking-wide text-accent-foreground">
            <Phone size={14} aria-hidden="true" />
            {ctas.call}
          </CallNow>
          <QuoteCta className="inline-flex min-h-12 items-center justify-center rounded-full bg-foreground px-3 text-[0.75rem] font-medium tracking-wide text-background">
            {ctas.quote}
          </QuoteCta>
        </div>
      </div>
    </div>
  );
}
