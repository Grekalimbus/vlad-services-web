import {
  GA_MEASUREMENT_ID,
  readCookieConsent,
} from "@/lib/cookie-consent";

const DEDUPE_PREFIX = "primefix-ga-lead:";
const trackedLeadKeys = new Set<string>();

export type GenerateLeadParams = {
  /** Stable id for this successful submission (lead UUID or one-off token). */
  dedupeKey: string;
  /** Where the form was shown (form id / placement). */
  formLocation: string;
  /** Selected service label when available — never PII. */
  serviceType?: string;
};

type GtagFn = (...args: unknown[]) => void;

function hasTracked(dedupeKey: string) {
  if (trackedLeadKeys.has(dedupeKey)) return true;
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(`${DEDUPE_PREFIX}${dedupeKey}`) === "1";
  } catch {
    return false;
  }
}

function markTracked(dedupeKey: string) {
  trackedLeadKeys.add(dedupeKey);
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(`${DEDUPE_PREFIX}${dedupeKey}`, "1");
  } catch {
    void 0;
  }
}

function getGtag(): GtagFn | null {
  if (typeof window === "undefined") return null;
  const gtag = (window as Window & { gtag?: GtagFn }).gtag;
  return typeof gtag === "function" ? gtag : null;
}

/**
 * Fires GA4 `generate_lead` only when cookie consent is accepted and gtag is present.
 * Skips silently on Reject / no GA / duplicate dedupeKey. Never sends PII fields.
 */
export function trackGenerateLead(input: GenerateLeadParams) {
  if (typeof window === "undefined") return false;
  if (readCookieConsent() !== "accepted") return false;
  if ((window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] === true) {
    return false;
  }

  const dedupeKey = input.dedupeKey.trim();
  const formLocation = input.formLocation.trim();
  if (!dedupeKey || !formLocation) return false;
  if (hasTracked(dedupeKey)) return false;

  const gtag = getGtag();
  if (!gtag) return false;

  const params: Record<string, string> = {
    form_location: formLocation,
  };
  const serviceType = input.serviceType?.trim();
  if (serviceType) params.service_type = serviceType;

  markTracked(dedupeKey);
  gtag("event", "generate_lead", params);
  return true;
}
