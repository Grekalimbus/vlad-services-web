"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type DealQuoteOption = {
  id: string;
  label: string;
};

export type DealQuoteContext = {
  /** Selected offer card id within the deals section. */
  selectedOfferId: string;
  /** All offer options for the current deals section. */
  offers: DealQuoteOption[];
};

type OpenQuoteOptions = {
  service?: string;
  dealQuote?: DealQuoteContext | null;
};

type QuoteContextValue = {
  open: boolean;
  service: string | null;
  dealQuote: DealQuoteContext | null;
  openQuote: (options?: OpenQuoteOptions) => void;
  closeQuote: () => void;
};

const QuoteContext = createContext<QuoteContextValue | null>(null);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [service, setService] = useState<string | null>(null);
  const [dealQuote, setDealQuote] = useState<DealQuoteContext | null>(null);

  const openQuote = useCallback((options: OpenQuoteOptions = {}) => {
    const nextDeal = options.dealQuote?.offers.length ? options.dealQuote : null;
    setService(options.service?.trim() ? options.service.trim() : null);
    setDealQuote(nextDeal);
    setOpen(true);
  }, []);

  const closeQuote = useCallback(() => {
    setOpen(false);
    setDealQuote(null);
  }, []);

  const value = useMemo(
    () => ({
      open,
      service,
      dealQuote,
      openQuote,
      closeQuote,
    }),
    [open, service, dealQuote, openQuote, closeQuote],
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
