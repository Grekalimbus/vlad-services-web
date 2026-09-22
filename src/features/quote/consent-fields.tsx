import Link from "next/link";
import { routes } from "@/lib/site";
import styles from "@/styles/forms.module.css";

export function ConsentFields() {
  return (
    <p className={styles.consent}>
      By submitting this form, you agree to receive recurring marketing and follow-up
      text messages from PrimeFix Home &amp; Handyman Services LLC, including messages
      sent using automated technology. Message frequency varies. Message and data rates
      may apply. Consent is not a condition of purchase. Reply STOP to opt out or HELP
      for help. If you provide an email address, you also agree to receive email
      messages. See our{" "}
      <Link href={routes.privacy} className={styles.consentLink}>
        Privacy Policy
      </Link>{" "}
      and{" "}
      <Link href={routes.messagingTerms} className={styles.consentLink}>
        Messaging Terms &amp; Conditions
      </Link>
      .
    </p>
  );
}
