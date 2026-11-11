"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { useSyncExternalStore } from "react";
import {
  COOKIE_CONSENT_EVENT,
  GA_MEASUREMENT_ID,
  readCookieConsent,
} from "@/lib/cookie-consent";

function subscribe(onStoreChange: () => void) {
  window.addEventListener(COOKIE_CONSENT_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(COOKIE_CONSENT_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

/**
 * Loads GA4 only after an explicit Accept stored in localStorage.
 * Server/hydration snapshot stays null so no script ships before consent.
 */
export function ConsentAnalytics() {
  const consent = useSyncExternalStore(subscribe, readCookieConsent, () => null);

  if (consent !== "accepted" || !GA_MEASUREMENT_ID) return null;
  return <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />;
}
