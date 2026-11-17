"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { QuoteForm } from "./quote-form";
import { useQuote } from "./quote-provider";
import shared from "@/styles/shared.module.css";
import styles from "@/styles/forms.module.css";

export function QuoteDialog() {
  const { open, service, dealQuote, closeQuote } = useQuote();
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
    <div className={styles.bookBackdrop}>
      <button
        type="button"
        aria-label="Close quote form"
        className={styles.bookDismiss}
        onClick={closeQuote}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={styles.bookDialog}
      >
        <button type="button" onClick={closeQuote} className={styles.bookClose}>
          <X size={16} aria-hidden="true" />
          <span className={shared.visuallyHidden}>Close</span>
        </button>
        <div className={styles.bookHeader}>
          <h2 id={titleId} className={styles.bookTitle}>
            Hire a <span>PRO</span>
          </h2>
        </div>
        <div className={styles.bookBody}>
          <QuoteForm
            key={dealQuote ? `deals-${dealQuote.selectedOfferId}` : `quote-${service ?? "none"}`}
            initialService={service ?? ""}
            formLocation={dealQuote ? "deals-page" : "quote-dialog"}
            dealQuote={dealQuote}
          />
        </div>
      </div>
    </div>
  );
}
