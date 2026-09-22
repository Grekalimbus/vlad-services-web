import Link from "next/link";
import { routes } from "@/lib/site";

export function ConsentFields() {
  return (
    <p className="text-xs leading-5 text-muted-foreground">
      By submitting this form, you agree to receive recurring marketing and follow-up
      text messages from PrimeFix Home &amp; Handyman Services LLC, including messages
      sent using automated technology. Message frequency varies. Message and data rates
      may apply. Consent is not a condition of purchase. Reply STOP to opt out or HELP
      for help. If you provide an email address, you also agree to receive email
      messages. See our{" "}
      <Link href={routes.privacy} className="underline underline-offset-2">
        Privacy Policy
      </Link>{" "}
      and{" "}
      <Link href={routes.messagingTerms} className="underline underline-offset-2">
        Messaging Terms &amp; Conditions
      </Link>
      .
    </p>
  );
}
