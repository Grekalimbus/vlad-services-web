"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LeadFormId } from "@/lib/leads";

export type QuoteFormKind = "quote" | "tv";

type QuoteContextValue = {
  open: boolean;
  form: QuoteFormKind;
  formId: LeadFormId;
  openQuote: (form?: QuoteFormKind) => void;
  closeQuote: () => void;
};

const QuoteContext = createContext<QuoteContextValue | null>(null);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<QuoteFormKind>("quote");

  const openQuote = useCallback((next: QuoteFormKind = "quote") => {
    setForm(next);
    setOpen(true);
  }, []);

  const closeQuote = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const key = "primefix-quote-shown";
    if (window.sessionStorage.getItem(key)) return;
    const timeout = window.setTimeout(() => {
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "true");
      setForm("quote");
      setOpen(true);
    }, 12000);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (open) window.sessionStorage.setItem("primefix-quote-shown", "true");
  }, [open]);

  const value = useMemo(
    () => ({
      open,
      form,
      formId: (form === "tv" ? "quote-dialog" : "quote-dialog") as LeadFormId,
      openQuote,
      closeQuote,
    }),
    [open, form, openQuote, closeQuote],
  );

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error("useQuote must be used within QuoteProvider");
  }
  return context;
}
