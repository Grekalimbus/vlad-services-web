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
  const title = booking ? "Book a Service" : cms.copy.forms.tvQuoteTitle;
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
        className={styles.dialogDismiss}
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
              <div>
                <h2 id={titleId} className={styles.bookTitle}>
                  Book <span>a Service</span>
                </h2>
                <p className={styles.bookLead}>Tell us about your project and we&apos;ll get back to you soon.</p>
              </div>
              <ToolsArt />
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
            <QuoteForm initialService={service ?? ""} />
          )}
        </div>
      </div>
    </div>
  );
}

function ToolsArt() {
  return (
    <svg className={styles.bookArt} viewBox="0 0 112 84" aria-hidden="true">
      <ellipse cx="56" cy="72" rx="28" ry="6" fill="#d7e8f6" />
      <path d="M34 38h44l6 28H28l6-28z" fill="#f4f8fb" stroke="#2580cd" strokeWidth="2" />
      <path d="M40 38c0-10 8-16 16-16s16 6 16 16" fill="none" stroke="#2580cd" strokeWidth="2" />
      <path d="M48 22v-8h6v8" stroke="#171717" strokeWidth="2" />
      <path d="M62 18l8-8 4 4-8 8" stroke="#2580cd" strokeWidth="2" fill="none" />
      <circle cx="74" cy="14" r="3" fill="#2580cd" />
      <path d="M46 48h8M46 54h14" stroke="#8aa4b8" strokeWidth="2" />
    </svg>
  );
}
