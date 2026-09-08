"use client";

import { FormEvent, useId, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

const phonePattern = /^[\d+\s()-]{10,20}$/;

const fieldClass =
  "mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

type BookingFormProps = {
  submitLabel?: string;
  notePlaceholder?: string;
  showNote?: boolean;
  tvCount?: string;
  compact?: boolean;
};

export function BookingForm({
  submitLabel = "Request a call",
  notePlaceholder = "Screen size, wall type, hide the cables…",
  showNote = true,
  tvCount,
  compact = false,
}: BookingFormProps) {
  const nameId = useId();
  const phoneId = useId();
  const noteId = useId();
  const errorId = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  function validate(name: string, phone: string) {
    const next: { name?: string; phone?: string } = {};
    if (name.trim().length < 2) {
      next.name = "A first name is enough — we use it when we call.";
    }
    if (!phonePattern.test(phone.trim())) {
      next.phone = "Add a phone number so we can confirm the visit.";
    }
    return next;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const phone = String(data.get("phone") ?? "");
    const nextErrors = validate(name, phone);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      document.getElementById(errorId)?.focus();
      return;
    }

    setStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 600));
    setStatus("success");
    form.reset();
  }

  if (status === "success") {
    return (
      <p
        role="status"
        className="rounded-sm border border-border bg-card p-6 text-sm leading-7 text-foreground md:p-8"
      >
        Thank you. In this local build the request stays on the page. Call us if
        you want the slot confirmed now.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {status === "error" ? (
        <p
          id={errorId}
          tabIndex={-1}
          role="alert"
          className="rounded-sm border border-destructive/30 bg-card px-4 py-3 text-sm text-destructive"
        >
          Check the fields below — we need a phone number to continue.
        </p>
      ) : null}

      {tvCount ? <input type="hidden" name="tvCount" value={tvCount} /> : null}

      <div className={`grid gap-5 ${compact ? "" : "sm:grid-cols-2"}`}>
        <div>
          <label htmlFor={nameId} className="text-sm font-medium">
            Name
          </label>
          <input
            id={nameId}
            name="name"
            autoComplete="name"
            onBlur={(event) => {
              const name = event.target.value;
              setErrors((current) => ({
                ...current,
                name:
                  name.trim().length < 2
                    ? "A first name is enough — we use it when we call."
                    : undefined,
              }));
            }}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${nameId}-error` : undefined}
            className={fieldClass}
          />
          {errors.name ? (
            <p id={`${nameId}-error`} className="mt-2 text-sm text-destructive">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor={phoneId} className="text-sm font-medium">
            Phone
            <span aria-hidden="true"> *</span>
          </label>
          <input
            id={phoneId}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            onBlur={(event) => {
              const phone = event.target.value;
              setErrors((current) => ({
                ...current,
                phone: phonePattern.test(phone.trim())
                  ? undefined
                  : "Add a phone number so we can confirm the visit.",
              }));
            }}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? `${phoneId}-error` : undefined}
            className={fieldClass}
          />
          {errors.phone ? (
            <p id={`${phoneId}-error`} className="mt-2 text-sm text-destructive">
              {errors.phone}
            </p>
          ) : null}
        </div>
      </div>

      {showNote ? (
        <div>
          <label htmlFor={noteId} className="text-sm font-medium">
            What should we mount?
          </label>
          <textarea
            id={noteId}
            name="note"
            rows={4}
            placeholder={notePlaceholder}
            className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm transition-colors duration-200 placeholder:text-muted-foreground/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          />
        </div>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : submitLabel}
      </button>
      <p className="text-xs leading-5 text-muted-foreground">
        Your number is only used to arrange the visit. We do not share it.
      </p>
    </form>
  );
}
