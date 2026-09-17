export const SMS_CONSENT_VERSION = "sms-marketing-v1";
export const EMAIL_CONSENT_VERSION = "email-marketing-v1";

export const SMS_CONSENT_TEXT =
  "I agree to receive recurring marketing and follow-up text messages from PrimeFix Home & Handyman Services LLC at the phone number provided, including messages sent using automated technology. Message frequency varies. Message and data rates may apply. Consent is not a condition of purchase. Reply STOP to opt out or HELP for help. See Privacy Policy and Messaging Terms & Conditions.";

export const EMAIL_CONSENT_TEXT =
  "I agree to receive email messages from PrimeFix Home & Handyman Services LLC at the email address provided, including follow-up and marketing messages. This is optional and separate from text message consent.";

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

export function buildConsentRecord(input: {
  channel: ConsentChannel;
  granted: boolean;
  phone?: string;
  email?: string;
  sourcePath: string;
  formId: string;
}): ConsentRecord {
  const text =
    input.channel === "sms" ? SMS_CONSENT_TEXT : EMAIL_CONSENT_TEXT;
  const version =
    input.channel === "sms" ? SMS_CONSENT_VERSION : EMAIL_CONSENT_VERSION;

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
