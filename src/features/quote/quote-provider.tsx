"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type QuoteFormKind = "quote" | "tv";

type QuoteContextValue = {
  open: boolean;
  form: QuoteFormKind;
  tvCount: string | null;
  openQuote: (form?: QuoteFormKind, tvCount?: string) => void;
  closeQuote: () => void;
};

const QuoteContext = createContext<QuoteContextValue | null>(null);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<QuoteFormKind>("quote");
  const [tvCount, setTvCount] = useState<string | null>(null);

  const openQuote = useCallback((next: QuoteFormKind = "quote", count?: string) => {
    setForm(next);
    setTvCount(next === "tv" && count ? count : null);
    setOpen(true);
  }, []);

  const closeQuote = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({
      open,
      form,
      tvCount,
      openQuote,
      closeQuote,
    }),
    [open, form, tvCount, openQuote, closeQuote],
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
