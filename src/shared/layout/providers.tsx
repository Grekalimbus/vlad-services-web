"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ConsentAnalytics, CookieBanner } from "@/features/consent";
import { QuoteProvider, useQuote } from "@/features/quote";
import { MobileCta } from "./mobile-cta";

const QuoteDialog = dynamic(
  () => import("@/features/quote/quote-dialog").then((mod) => mod.QuoteDialog),
  { ssr: false },
);

const DealsPopup = dynamic(
  () => import("@/features/home/deals-popup").then((mod) => mod.DealsPopup),
  { ssr: false },
);

const ReviewPopup = dynamic(
  () => import("@/features/reviews/review-popup").then((mod) => mod.ReviewPopup),
  { ssr: false },
);

const VisualEditor = dynamic(
  () => import("@/features/editor/visual-editor").then((mod) => mod.VisualEditor),
  { ssr: false },
);

function QuoteDialogHost() {
  const { open } = useQuote();
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (open) setArmed(true);
  }, [open]);

  if (!armed) return null;
  return <QuoteDialog />;
}

function DelayedMount({ delayMs, children }: { delayMs: number; children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs]);

  if (!ready) return null;
  return children;
}

export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const admin = pathname.startsWith("/admin");
  return (
    <QuoteProvider>
      {children}
      {admin ? null : <QuoteDialogHost />}
      {admin ? null : (
        <DelayedMount delayMs={2000}>
          <ReviewPopup />
        </DelayedMount>
      )}
      {admin ? null : (
        <DelayedMount delayMs={35_000}>
          <DealsPopup />
        </DelayedMount>
      )}
      {admin ? null : <CookieBanner />}
      {admin ? null : <ConsentAnalytics />}
      {admin ? null : <MobileCta />}
      <VisualEditor />
    </QuoteProvider>
  );
}
