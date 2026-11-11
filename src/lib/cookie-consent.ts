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

function isGoogleAnalyticsCookieName(name: string) {
  return name === "_ga" || name.startsWith("_ga_");
}

function cookieDomainsForHost(hostname: string) {
  const bare = hostname.replace(/^www\./i, "");
  const domains = new Set<string | undefined>([undefined, hostname, `.${hostname}`]);
  if (bare && bare !== hostname) {
    domains.add(bare);
    domains.add(`.${bare}`);
  }
  return [...domains];
}

/** Remove first-party GA cookies this origin can expire (not HttpOnly/server-only cookies). */
export function clearGoogleAnalyticsCookies() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const names = document.cookie
    .split(";")
    .map((part) => part.split("=")[0]?.trim())
    .filter((name): name is string => Boolean(name) && isGoogleAnalyticsCookieName(name));

  if (!names.length) return;

  const domains = cookieDomainsForHost(window.location.hostname);
  const paths = ["/", window.location.pathname || "/"];
  const expire = "Thu, 01 Jan 1970 00:00:00 GMT";

  for (const name of names) {
    for (const path of paths) {
      for (const domain of domains) {
        const domainPart = domain ? `; domain=${domain}` : "";
        document.cookie = `${name}=; expires=${expire}; path=${path}${domainPart}`;
      }
    }
  }
}
