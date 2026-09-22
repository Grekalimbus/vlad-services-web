"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ctas, site } from "@/lib/site";
import { buttonPrimaryClass, buttonSecondaryClass } from "@/lib/forms";
import { useQuote } from "./quote-provider";

type CtaProps = {
  className?: string;
  children?: ReactNode;
};

export function QuoteCta({ className = buttonPrimaryClass, children }: CtaProps) {
  const { openQuote } = useQuote();

  return (
    <button type="button" className={className} onClick={() => openQuote("quote")}>
      {children ?? ctas.quote}
    </button>
  );
}

export function TvQuoteCta({ className = buttonPrimaryClass, children }: CtaProps) {
  const { openQuote } = useQuote();

  return (
    <button type="button" className={className} onClick={() => openQuote("tv")}>
      {children ?? ctas.quote}
    </button>
  );
}

export function CallNow({ className = buttonSecondaryClass, children }: CtaProps) {
  return (
    <a href={site.phoneHref} className={className}>
      {children ?? ctas.call}
    </a>
  );
}

export function BookService({ className = buttonSecondaryClass, children }: CtaProps) {
  return (
    <Link href="/contact" className={className}>
      {children ?? ctas.book}
    </Link>
  );
}
