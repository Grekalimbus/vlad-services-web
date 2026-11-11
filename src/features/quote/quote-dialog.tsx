"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { QuoteForm } from "./quote-form";
import { TvQuoteForm } from "./tv-quote-form";
import { useCms } from "@/lib/cms/use-cms";
import { useQuote } from "./quote-provider";
import shared from "@/styles/shared.module.css";
import styles from "@/styles/forms.module.css";

export function QuoteDialog() {
  const { open, form, tvCount, service, closeQuote } = useQuote();
  const cms = useCms();
  const booking = form === "quote";
  const title = cms.copy.forms.tvQuoteTitle;
  const titlePath = booking ? undefined : "copy.forms.tvQuoteTitle";
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
    <div className={booking ? styles.bookBackdrop : styles.dialogBackdrop}>
      <button
        type="button"
        aria-label="Close quote form"
        className={booking ? styles.bookDismiss : styles.dialogDismiss}
        onClick={closeQuote}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={booking ? styles.bookDialog : styles.dialog}
      >
        {booking ? (
          <>
            <button type="button" onClick={closeQuote} className={styles.bookClose}>
              <X size={16} aria-hidden="true" />
              <span className={shared.visuallyHidden}>Close</span>
            </button>
            <div className={styles.bookHeader}>
              <h2 id={titleId} className={styles.bookTitle}>
                Hire a <span>PRO</span>
              </h2>
            </div>
          </>
        ) : (
          <div className={styles.dialogHeader}>
            <div className={styles.dialogTitleWrap}>
              <h2 id={titleId} className={styles.dialogTitle} data-cms={titlePath}>
                {title}
              </h2>
            </div>
            <button type="button" onClick={closeQuote} className={styles.dialogClose}>
              <X size={16} aria-hidden="true" />
              <span className={shared.visuallyHidden}>Close</span>
            </button>
          </div>
        )}
        <div className={booking ? styles.bookBody : styles.dialogBody}>
          {form === "tv" ? (
            <TvQuoteForm formId="quote-dialog" compact tvCount={tvCount ?? undefined} />
          ) : (
            <QuoteForm initialService={service ?? ""} formLocation="quote-dialog" />
          )}
        </div>
      </div>
    </div>
  );
}
