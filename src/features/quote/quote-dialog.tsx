"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { QuoteForm } from "./quote-form";
import { TvQuoteForm } from "./tv-quote-form";
import { useQuote } from "./quote-provider";
import shared from "@/styles/shared.module.css";
import styles from "@/styles/forms.module.css";

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
    <div className={styles.dialogBackdrop}>
      <button
        type="button"
        aria-label="Close quote form"
        className={styles.dialogDismiss}
        onClick={closeQuote}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={styles.dialog}
      >
        <div className={styles.dialogHeader}>
          <div className={styles.dialogTitleWrap}>
            <h2 id={titleId} className={styles.dialogTitle}>
              {form === "tv" ? "TV Mounting Quote" : "Get Quote"}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeQuote}
            className={styles.dialogClose}
          >
            <X size={16} aria-hidden="true" />
            <span className={shared.visuallyHidden}>Close</span>
          </button>
        </div>
        <div className={styles.dialogBody}>
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
