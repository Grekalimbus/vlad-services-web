"use client";

import { FormEvent, useId, useState, type HTMLAttributes } from "react";
import { ConsentFields } from "@/components/consent-fields";
import { ctas } from "@/lib/site";
import { quoteServices } from "@/lib/services";
import {
  emailPattern,
  fieldClass,
  phonePattern,
  textareaClass,
  zipPattern,
} from "@/lib/forms";
import {
  buildLeadPayload,
  filesFromFormData,
  quoteSuccessMessage,
  submitLead,
  type LeadFormId,
} from "@/lib/leads";

type Status = "idle" | "loading" | "success" | "error";

type QuoteFormProps = {
  formId?: LeadFormId;
  defaultService?: string;
  compact?: boolean;
  onSuccess?: () => void;
};

type FieldErrors = {
  name?: string;
  phone?: string;
  zip?: string;
  service?: string;
  description?: string;
  photos?: string;
  email?: string;
  smsConsent?: string;
  emailConsent?: string;
};

export function QuoteForm({
  formId = "general-quote",
  defaultService,
  compact = false,
  onSuccess,
}: QuoteFormProps) {
  const ids = {
    name: useId(),
    phone: useId(),
    email: useId(),
    zip: useId(),
    service: useId(),
    description: useId(),
    photos: useId(),
    date: useId(),
    sms: useId(),
    emailConsent: useId(),
    error: useId(),
  };
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [photoNames, setPhotoNames] = useState<string[]>([]);
  const [smsConsent, setSmsConsent] = useState(false);
  const [emailConsent, setEmailConsent] = useState(false);
  const canSubmit = smsConsent && emailConsent && status !== "loading";

  function validate(data: FormData): FieldErrors {
    const next: FieldErrors = {};
    const name = String(data.get("name") ?? "");
    const phone = String(data.get("phone") ?? "");
    const email = String(data.get("email") ?? "").trim();
    const zip = String(data.get("zip") ?? "");
    const service = String(data.get("service") ?? "");
    const description = String(data.get("description") ?? "");
    const photos = filesFromFormData(data, "photos");

    if (name.trim().length < 2) next.name = "Enter your name.";
    if (!phonePattern.test(phone.trim())) next.phone = "Enter a phone number.";
    if (email && !emailPattern.test(email)) next.email = "Enter a valid email or leave this blank.";
    if (!zipPattern.test(zip.trim())) next.zip = "Enter a 5-digit ZIP code.";
    if (!service) next.service = "Choose a service.";
    if (description.trim().length < 8) {
      next.description = "Briefly describe the project.";
    }
    if (photos.length === 0) next.photos = "Upload at least one photo of the project.";
    if (data.get("smsConsent") !== "on") next.smsConsent = "Check this box to continue.";
    if (data.get("emailConsent") !== "on") next.emailConsent = "Check this box to continue.";
    return next;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors = validate(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      document.getElementById(ids.error)?.focus();
      return;
    }

    setStatus("loading");
    const payload = buildLeadPayload({
      type: "quote",
      formId,
      fields: {
        name: String(data.get("name") ?? ""),
        phone: String(data.get("phone") ?? ""),
        email: String(data.get("email") ?? ""),
        zip: String(data.get("zip") ?? ""),
        service: String(data.get("service") ?? ""),
        description: String(data.get("description") ?? ""),
        preferredDate: String(data.get("preferredDate") ?? ""),
      },
      photos: filesFromFormData(data, "photos"),
      smsConsent: data.get("smsConsent") === "on",
      emailConsent: data.get("emailConsent") === "on" && Boolean(String(data.get("email") ?? "").trim()),
    });

    await submitLead(payload);
    setStatus("success");
    form.reset();
    setPhotoNames([]);
    setSmsConsent(false);
    setEmailConsent(false);
    onSuccess?.();
  }

  if (status === "success") {
    return (
      <p
        role="status"
        className="rounded-sm border border-border bg-card p-6 text-sm leading-7 text-foreground md:p-8"
      >
        {quoteSuccessMessage}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {status === "error" ? (
        <p
          id={ids.error}
          tabIndex={-1}
          role="alert"
          className="rounded-sm border border-destructive/30 bg-card px-4 py-3 text-sm text-destructive"
        >
          Check the fields below and both consent boxes before sending.
        </p>
      ) : null}

      <div className={`grid gap-5 ${compact ? "" : "sm:grid-cols-2"}`}>
        <Field
          id={ids.name}
          name="name"
          label="Name"
          required
          autoComplete="name"
          error={errors.name}
          className={fieldClass}
        />
        <Field
          id={ids.phone}
          name="phone"
          label="Phone Number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          error={errors.phone}
          className={fieldClass}
        />
      </div>

      <div className={`grid gap-5 ${compact ? "" : "sm:grid-cols-2"}`}>
        <Field
          id={ids.email}
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          optional
          error={errors.email}
          className={fieldClass}
        />
        <Field
          id={ids.zip}
          name="zip"
          label="ZIP Code"
          inputMode="numeric"
          autoComplete="postal-code"
          required
          error={errors.zip}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor={ids.service} className="text-sm font-medium">
          Service Needed
          <span aria-hidden="true"> *</span>
        </label>
        <select
          id={ids.service}
          name="service"
          required
          defaultValue={defaultService ?? ""}
          aria-invalid={Boolean(errors.service)}
          className={fieldClass}
        >
          <option value="" disabled>
            Select a service
          </option>
          {quoteServices.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
        {errors.service ? (
          <p className="mt-2 text-sm text-destructive">{errors.service}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor={ids.description} className="text-sm font-medium">
          Briefly describe your project
          <span aria-hidden="true"> *</span>
        </label>
        <textarea
          id={ids.description}
          name="description"
          required
          rows={4}
          aria-invalid={Boolean(errors.description)}
          className={textareaClass}
        />
        {errors.description ? (
          <p className="mt-2 text-sm text-destructive">{errors.description}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor={ids.photos} className="text-sm font-medium">
          Upload Photos
          <span aria-hidden="true"> *</span>
        </label>
        <p className="mt-1 text-xs text-muted-foreground">
          Photos help PrimeFix evaluate the work and estimate pricing.
        </p>
        <input
          id={ids.photos}
          name="photos"
          type="file"
          accept="image/*"
          multiple
          required
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            setPhotoNames(files.map((file) => file.name));
          }}
          aria-invalid={Boolean(errors.photos)}
          className="mt-2 w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-foreground file:px-4 file:py-2 file:text-xs file:font-medium file:text-background"
        />
        {photoNames.length > 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">{photoNames.join(", ")}</p>
        ) : null}
        {errors.photos ? (
          <p className="mt-2 text-sm text-destructive">{errors.photos}</p>
        ) : null}
      </div>

      <Field
        id={ids.date}
        name="preferredDate"
        label="Preferred Date"
        type="date"
        optional
        className={fieldClass}
      />

      <ConsentFields
        smsId={ids.sms}
        emailId={ids.emailConsent}
        smsChecked={smsConsent}
        emailChecked={emailConsent}
        onSmsChange={setSmsConsent}
        onEmailChange={setEmailConsent}
        smsError={errors.smsConsent}
        emailError={errors.emailConsent}
      />

      <button type="submit" disabled={!canSubmit} className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-60">
        {status === "loading" ? "Sending…" : ctas.quote}
      </button>
      <p className="text-xs leading-5 text-muted-foreground">
        Check both boxes to send your quote. Fields are still checked before the request is sent.
      </p>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  optional = false,
  required = false,
  error,
  className,
  autoComplete,
  inputMode,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  optional?: boolean;
  required?: boolean;
  error?: string;
  className: string;
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
        {optional ? (
          <span className="ml-2 text-xs font-normal text-muted-foreground">Optional</span>
        ) : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        required={required}
        aria-invalid={Boolean(error)}
        className={className}
      />
      {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
