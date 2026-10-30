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
  service: string | null;
  openQuote: (form?: QuoteFormKind, tvCount?: string, service?: string) => void;
  closeQuote: () => void;
};

const QuoteContext = createContext<QuoteContextValue | null>(null);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<QuoteFormKind>("quote");
  const [tvCount, setTvCount] = useState<string | null>(null);
  const [service, setService] = useState<string | null>(null);

  const openQuote = useCallback((next: QuoteFormKind = "quote", count?: string, serviceName?: string) => {
    setForm(next);
    setTvCount(next === "tv" && count ? count : null);
    setService(next === "quote" && serviceName ? serviceName : null);
    setOpen(true);
  }, []);

  const closeQuote = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({
      open,
      form,
      tvCount,
      service,
      openQuote,
      closeQuote,
    }),
    [open, form, tvCount, service, openQuote, closeQuote],
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
