"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { SMS_CONSENT_TEXT } from "@/lib/consent";
import { routes } from "@/lib/site";

type ConsentFieldsProps = {
  smsId: string;
  emailId: string;
  smsChecked: boolean;
  emailChecked: boolean;
  onSmsChange: (checked: boolean) => void;
  onEmailChange: (checked: boolean) => void;
  smsError?: string;
  emailError?: string;
};

export function ConsentFields({
  smsId,
  emailId,
  smsChecked,
  emailChecked,
  onSmsChange,
  onEmailChange,
  smsError,
  emailError,
}: ConsentFieldsProps) {
  function keepCheckboxState(event: MouseEvent<HTMLAnchorElement>) {
    event.stopPropagation();
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor={smsId} className="flex cursor-pointer gap-3 text-xs leading-5 text-muted-foreground">
          <input
            id={smsId}
            name="smsConsent"
            type="checkbox"
            required
            aria-invalid={Boolean(smsError)}
            checked={smsChecked}
            onChange={(event) => onSmsChange(event.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-accent"
          />
          <span>
            I agree to receive recurring marketing and follow-up text messages from
            PrimeFix Home & Handyman Services LLC at the phone number provided,
            including messages sent using automated technology. Message frequency
            varies. Message and data rates may apply. Consent is not a condition of
            purchase. Reply STOP to opt out or HELP for help. See{" "}
            <Link
              href={routes.privacy}
              className="underline underline-offset-2"
              onClick={keepCheckboxState}
            >
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link
              href={routes.messagingTerms}
              className="underline underline-offset-2"
              onClick={keepCheckboxState}
            >
              Messaging Terms & Conditions
            </Link>
            .
          </span>
        </label>
        {smsError ? <p className="mt-2 text-sm text-destructive">{smsError}</p> : null}
      </div>
      <div>
        <label htmlFor={emailId} className="flex cursor-pointer gap-3 text-xs leading-5 text-muted-foreground">
          <input
            id={emailId}
            name="emailConsent"
            type="checkbox"
            required
            aria-invalid={Boolean(emailError)}
            checked={emailChecked}
            onChange={(event) => onEmailChange(event.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-accent"
          />
          <span>
            I agree to receive email messages from PrimeFix Home & Handyman
            Services LLC at the email address provided, including follow-up and
            marketing messages. This is separate from text message consent.
          </span>
        </label>
        {emailError ? <p className="mt-2 text-sm text-destructive">{emailError}</p> : null}
      </div>
      <p className="sr-only">{SMS_CONSENT_TEXT}</p>
    </div>
  );
}
