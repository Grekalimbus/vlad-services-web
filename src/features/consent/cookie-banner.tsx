"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import {
  clearGoogleAnalyticsCookies,
  COOKIE_CONSENT_EVENT,
  COOKIE_CONSENT_OPEN_EVENT,
  readCookieConsent,
  setGoogleAnalyticsDisabled,
  writeCookieConsent,
  type CookieConsentValue,
} from "@/lib/cookie-consent";
import { routes } from "@/lib/site";
import styles from "./cookie-banner.module.css";

function subscribeConsent(onStoreChange: () => void) {
  window.addEventListener(COOKIE_CONSENT_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(COOKIE_CONSENT_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function subscribeMounted() {
  return () => undefined;
}

export function CookieBanner() {
  const pathname = usePathname();
  const admin = pathname.startsWith("/admin");
  const mounted = useSyncExternalStore(subscribeMounted, () => true, () => false);
  const consent = useSyncExternalStore(subscribeConsent, readCookieConsent, () => null);
  const [forced, setForced] = useState(false);

  useEffect(() => {
    const onOpen = () => setForced(true);
    window.addEventListener(COOKIE_CONSENT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(COOKIE_CONSENT_OPEN_EVENT, onOpen);
  }, []);

  if (admin || !mounted) return null;
  if (consent && !forced) return null;

  const choose = (value: CookieConsentValue) => {
    setGoogleAnalyticsDisabled(value === "rejected");
    if (value === "rejected") clearGoogleAnalyticsCookies();
    writeCookieConsent(value);
    setForced(false);
  };

  return (
    <aside className={styles.slot} aria-label="Cookie consent" role="dialog" aria-live="polite">
      <div className={styles.panel}>
        <p className={styles.copy}>
          We use cookies for analytics to improve the site. See our{" "}
          <Link href={routes.privacy} className={styles.link}>
            Privacy Policy
          </Link>
          .
        </p>
        <div className={styles.actions}>
          <button type="button" className={styles.reject} onClick={() => choose("rejected")}>
            Reject
          </button>
          <button type="button" className={styles.accept} onClick={() => choose("accepted")}>
            Accept
          </button>
        </div>
      </div>
    </aside>
  );
}
