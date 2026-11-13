"use client";

import type { ReactNode } from "react";
import { useCms } from "@/lib/cms/use-cms";
import { phoneHref } from "@/lib/site";
import { buttonPrimaryClass, buttonSecondaryClass } from "@/lib/forms";
import { useQuote } from "./quote-provider";

type CtaProps = {
  className?: string;
  children?: ReactNode;
};

export function QuoteCta({ className = buttonPrimaryClass, children }: CtaProps) {
  const { openQuote } = useQuote();
  const quote = useCms().ctas.quote;

  return (
    <button type="button" className={className} onClick={() => openQuote("quote")}>
      {children ?? quote}
    </button>
  );
}

export function TvQuoteCta({ className = buttonPrimaryClass, children }: CtaProps) {
  const { openQuote } = useQuote();
  const quote = useCms().ctas.quote;

  return (
    <button type="button" className={className} onClick={() => openQuote("tv")}>
      {children ?? quote}
    </button>
  );
}

export function CallNow({ className = buttonSecondaryClass, children }: CtaProps) {
  const cms = useCms();
  return (
    <a href={phoneHref(cms.site.phoneDisplay)} className={className}>
      {children ?? cms.site.phoneDisplay}
    </a>
  );
}
