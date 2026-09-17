"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { QuoteForm } from "@/components/quote-form";
import { TvQuoteForm } from "@/components/tv-quote-form";
import { useQuote } from "@/components/quote-provider";

export function QuoteDialog() {
  const { open, form, closeQuote } = useQuote();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeQuote();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeQuote]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close quote form"
        className="absolute inset-0 bg-foreground/45"
        onClick={closeQuote}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative z-10 mb-[4.75rem] max-h-[min(92dvh,calc(100dvh-5.5rem))] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-border bg-background p-5 shadow-[0_20px_50px_rgb(23_23_23/0.2)] sm:mb-0 sm:max-h-[92dvh] sm:rounded-sm sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Free quote</p>
            <h2 id={titleId} className="mt-2 text-2xl font-medium tracking-[-0.03em]">
              {form === "tv" ? "TV mounting quote" : "Get a free quote"}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeQuote}
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-border"
          >
            <X size={16} aria-hidden="true" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="mt-6">
          {form === "tv" ? (
            <TvQuoteForm formId="quote-dialog" compact />
          ) : (
            <QuoteForm formId="quote-dialog" compact />
          )}
        </div>
      </div>
    </div>
  );
}
