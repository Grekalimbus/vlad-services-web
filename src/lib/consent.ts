export const SMS_CONSENT_VERSION = "sms-marketing-v2";
export const EMAIL_CONSENT_VERSION = "email-marketing-v3";

export const SMS_CONSENT_TEXT =
  "I agree to receive recurring marketing and follow-up text messages from PrimeFix at the phone number provided. Message frequency varies. Message and data rates may apply. Reply STOP to opt out and HELP for help. Consent is not a condition of purchase. See Privacy Policy and Messaging Terms & Conditions.";

export const EMAIL_CONSENT_TEXT =
  "I agree to receive promotional emails from PrimeFix. I can unsubscribe at any time.";

export type ConsentChannel = "sms" | "email";

export type ConsentRecord = {
  channel: ConsentChannel;
  granted: boolean;
  timestamp: string | null;
  phone: string | null;
  email: string | null;
  sourcePath: string;
  formId: string;
  text: string;
  version: string;
};

export type ApplicationConsents = {
  privacyPolicy: "accepted" | "na";
  smsMarketing: "yes" | "no" | "na";
  emailMarketing: "yes" | "no" | "na";
  submittedAt: string;
  smsText: string | null;
  emailText: string | null;
  smsGrantedAt: string | null;
  emailGrantedAt: string | null;
};

export function buildConsentRecord(input: {
  channel: ConsentChannel;
  granted: boolean;
  phone?: string;
  email?: string;
  sourcePath: string;
  formId: string;
}): ConsentRecord {
  const text = input.channel === "sms" ? SMS_CONSENT_TEXT : EMAIL_CONSENT_TEXT;
  const version = input.channel === "sms" ? SMS_CONSENT_VERSION : EMAIL_CONSENT_VERSION;

  return {
    channel: input.channel,
    granted: input.granted,
    timestamp: input.granted ? new Date().toISOString() : null,
    phone: input.channel === "sms" ? (input.phone ?? null) : null,
    email: input.channel === "email" ? (input.email ?? null) : null,
    sourcePath: input.sourcePath,
    formId: input.formId,
    text,
    version,
  };
}

export function buildApplicationConsents(input: {
  privacyPolicy?: "accepted" | "na";
  smsConsent: boolean | null;
  emailConsent: boolean | null;
  submittedAt?: string;
}): ApplicationConsents {
  const submittedAt = input.submittedAt ?? new Date().toISOString();
  const smsShown = input.smsConsent !== null;
  const emailShown = input.emailConsent !== null;
  const smsGranted = input.smsConsent === true;
  const emailGranted = input.emailConsent === true;

  return {
    privacyPolicy: input.privacyPolicy ?? "accepted",
    smsMarketing: !smsShown ? "na" : smsGranted ? "yes" : "no",
    emailMarketing: !emailShown ? "na" : emailGranted ? "yes" : "no",
    submittedAt,
    smsText: smsShown ? SMS_CONSENT_TEXT : null,
    emailText: emailShown ? EMAIL_CONSENT_TEXT : null,
    smsGrantedAt: smsGranted ? submittedAt : null,
    emailGrantedAt: emailGranted ? submittedAt : null,
  };
}

export function parseApplicationConsents(value: unknown): ApplicationConsents | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const item = value as Record<string, unknown>;
  const privacy =
    item.privacyPolicy === "accepted" || item.privacyPolicy === "na" ? item.privacyPolicy : null;
  const sms =
    item.smsMarketing === "yes" || item.smsMarketing === "no" || item.smsMarketing === "na"
      ? item.smsMarketing
      : null;
  const email =
    item.emailMarketing === "yes" || item.emailMarketing === "no" || item.emailMarketing === "na"
      ? item.emailMarketing
      : null;
  if (!privacy || !sms || !email || typeof item.submittedAt !== "string") return null;
  return {
    privacyPolicy: privacy,
    smsMarketing: sms,
    emailMarketing: email,
    submittedAt: item.submittedAt,
    smsText: typeof item.smsText === "string" ? item.smsText : null,
    emailText: typeof item.emailText === "string" ? item.emailText : null,
    smsGrantedAt: typeof item.smsGrantedAt === "string" ? item.smsGrantedAt : null,
    emailGrantedAt: typeof item.emailGrantedAt === "string" ? item.emailGrantedAt : null,
  };
}
