"use client";

import { FormEvent, useId, useState } from "react";
import { ConsentFields } from "@/components/consent-fields";
import { emailPattern, fieldClass, phonePattern, zipPattern } from "@/lib/forms";
import { buildLeadPayload, submitLead } from "@/lib/leads";

type Status = "idle" | "loading" | "success" | "error";

export function DealsSignup() {
  const ids = {
    name: useId(),
    phone: useId(),
    zip: useId(),
    email: useId(),
    error: useId(),
  };
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const zip = String(data.get("zip") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const nextErrors: Record<string, string> = {};

    if (name.length < 2) nextErrors.name = "Enter your name.";
    if (!phonePattern.test(phone)) nextErrors.phone = "Enter a phone number.";
    if (!zipPattern.test(zip)) nextErrors.zip = "Enter a 5-digit ZIP code.";
    if (email && !emailPattern.test(email)) nextErrors.email = "Enter a valid email.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      document.getElementById(ids.error)?.focus();
      return;
    }

    setStatus("loading");
    await submitLead(
      buildLeadPayload({
        type: "deals",
        formId: "deals-signup",
        fields: { name, phone, zip, email },
        photos: [],
        smsConsent: true,
        emailConsent: Boolean(email),
      }),
    );
    form.reset();
    setStatus("success");
  }

  if (status === "success") {
    return (
      <p role="status" className="rounded-sm border border-border bg-card p-6">
        Thank you! You&apos;re signed up for PrimeFix deals.
      </p>
    );
  }

  return (
    <section id="contact" aria-labelledby="deals-heading" className="border-b border-border">
      <div className="container-page py-16 md:py-20">
        <h2 id="deals-heading" className="text-3xl font-medium tracking-[-0.03em] md:text-4xl">
          Sign Up for Deals
        </h2>
        <form onSubmit={onSubmit} noValidate className="mx-auto mt-8 max-w-4xl">
          {status === "error" ? (
            <p id={ids.error} tabIndex={-1} role="alert" className="mb-5 text-sm text-destructive">
              Check the fields below before sending.
            </p>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DealField id={ids.name} name="name" label="Name" error={errors.name} />
            <DealField
              id={ids.phone}
              name="phone"
              label="Phone Number"
              type="tel"
              autoComplete="tel"
              error={errors.phone}
            />
            <DealField
              id={ids.zip}
              name="zip"
              label="ZIP Code"
              inputMode="numeric"
              autoComplete="postal-code"
              error={errors.zip}
            />
            <DealField
              id={ids.email}
              name="email"
              label="Email (Optional)"
              type="email"
              autoComplete="email"
              error={errors.email}
            />
          </div>
          <div className="mx-auto mt-6 max-w-2xl">
            <ConsentFields />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-6 inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full bg-accent px-7 text-sm font-medium text-accent-foreground transition-colors hover:bg-foreground hover:text-background disabled:cursor-wait disabled:opacity-60"
          >
            {status === "loading" ? "Sending…" : "Sign Up"}
          </button>
        </form>
      </div>
    </section>
  );
}

function DealField({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  inputMode,
  error,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  inputMode?: "numeric";
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        className={fieldClass}
      />
      {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
