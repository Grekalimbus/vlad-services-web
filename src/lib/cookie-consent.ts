export const COOKIE_CONSENT_KEY = "primefix-cookie-consent";
export const COOKIE_CONSENT_EVENT = "primefix-cookie-consent";
export const COOKIE_CONSENT_OPEN_EVENT = "primefix-cookie-consent-open";

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "G-R1EWB8T76C";

export type CookieConsentValue = "accepted" | "rejected";

export type CookieConsentDetail = {
  value: CookieConsentValue | null;
};

function isConsentValue(value: unknown): value is CookieConsentValue {
  return value === "accepted" || value === "rejected";
}

export function readCookieConsent(): CookieConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    return isConsentValue(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function writeCookieConsent(value: CookieConsentValue) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
  } catch {
    void 0;
  }
  window.dispatchEvent(
    new CustomEvent<CookieConsentDetail>(COOKIE_CONSENT_EVENT, { detail: { value } }),
  );
}

export function clearCookieConsent() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(COOKIE_CONSENT_KEY);
  } catch {
    void 0;
  }
  window.dispatchEvent(
    new CustomEvent<CookieConsentDetail>(COOKIE_CONSENT_EVENT, { detail: { value: null } }),
  );
}

export function openCookieConsentBanner() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(COOKIE_CONSENT_OPEN_EVENT));
}

/** Toggle the GA disable flag for an already-injected tag in this page session. */
export function setGoogleAnalyticsDisabled(
  disabled: boolean,
  measurementId = GA_MEASUREMENT_ID,
) {
  if (typeof window === "undefined") return;
  Object.assign(window, { [`ga-disable-${measurementId}`]: disabled });
}
