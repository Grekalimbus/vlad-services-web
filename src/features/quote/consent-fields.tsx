"use client";

import Link from "next/link";
import { EMAIL_CONSENT_TEXT, SMS_CONSENT_TEXT } from "@/lib/consent";
import { routes } from "@/lib/site";
import { Checkbox } from "@/shared/ui";
import styles from "@/styles/forms.module.css";

const SMS_LINK_LEAD = "See ";

export function ConsentFields({
  email = true,
  tone = "default",
  invalidSms = false,
  invalidEmail = false,
}: {
  email?: boolean;
  tone?: "default" | "inverse";
  invalidSms?: boolean;
  invalidEmail?: boolean;
}) {
  const linkAt = SMS_CONSENT_TEXT.lastIndexOf(SMS_LINK_LEAD);
  const smsBefore = SMS_CONSENT_TEXT.slice(0, linkAt);
  const choice = tone === "inverse" ? styles.consentOnDark : styles.consentChoice;

  return (
    <fieldset className={styles.consentFields}>
      <legend className={styles.srOnly}>Message preferences</legend>
      <Checkbox name="smsConsent" value="yes" className={choice} invalid={invalidSms}>
        {smsBefore}
        {SMS_LINK_LEAD}
        <Link href={routes.privacy} className={styles.consentLink}>
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href={routes.messagingTerms} className={styles.consentLink}>
          Messaging Terms & Conditions
        </Link>
        .
      </Checkbox>
      {email ? (
        <Checkbox name="emailConsent" value="yes" className={choice} invalid={invalidEmail}>
          {EMAIL_CONSENT_TEXT}
        </Checkbox>
      ) : null}
    </fieldset>
  );
}
