"use client";

import Link from "next/link";
import { EMAIL_CONSENT_TEXT, SMS_CONSENT_TEXT } from "@/lib/consent";
import { routes } from "@/lib/site";
import { Checkbox } from "@/shared/ui";
import styles from "@/styles/forms.module.css";

const SMS_LINK_LEAD = "See ";

export function ConsentFields({
  sms = true,
  email = true,
  tone = "default",
  invalidSms = false,
  invalidEmail = false,
}: {
  sms?: boolean;
  email?: boolean;
  tone?: "default" | "inverse";
  invalidSms?: boolean;
  invalidEmail?: boolean;
}) {
  if (!sms && !email) return null;

  const linkAt = SMS_CONSENT_TEXT.lastIndexOf(SMS_LINK_LEAD);
  const smsBefore = linkAt >= 0 ? SMS_CONSENT_TEXT.slice(0, linkAt) : SMS_CONSENT_TEXT;
  const choice = tone === "inverse" ? styles.consentOnDark : styles.consentChoice;

  return (
    <fieldset className={styles.consentFields}>
      <legend className={styles.srOnly}>Message preferences</legend>
      {sms ? (
        <Checkbox name="smsConsent" value="yes" className={choice} invalid={invalidSms}>
          {smsBefore}
          {linkAt >= 0 ? (
            <>
              {SMS_LINK_LEAD}
              <Link href={routes.privacy} className={styles.consentLink}>
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href={routes.messagingTerms} className={styles.consentLink}>
                Messaging Terms & Conditions
              </Link>
              .
            </>
          ) : null}
        </Checkbox>
      ) : null}
      {email ? (
        <Checkbox name="emailConsent" value="yes" className={choice} invalid={invalidEmail}>
          {EMAIL_CONSENT_TEXT}
        </Checkbox>
      ) : null}
    </fieldset>
  );
}

export function PrivacyNotice({
  variant = "submit",
  tone = "default",
}: {
  variant?: "submit" | "signup";
  tone?: "default" | "inverse" | "onDark";
}) {
  const lead =
    variant === "signup"
      ? "By signing up, you agree to our "
      : "By submitting this form, you agree to our ";
  const className =
    tone === "inverse"
      ? styles.privacyNoticeInverse
      : tone === "onDark"
        ? styles.privacyNoticeOnDark
        : styles.privacyNotice;

  return (
    <p className={className}>
      {lead}
      <Link href={routes.privacy} className={styles.consentLink}>
        Privacy Policy
      </Link>
      .
    </p>
  );
}
