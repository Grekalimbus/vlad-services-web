"use client";

import { FormEvent, useId, useState, type HTMLAttributes } from "react";
import { ConsentFields } from "./consent-fields";
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
import styles from "@/styles/forms.module.css";

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
    error: useId(),
  };
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [photoNames, setPhotoNames] = useState<string[]>([]);
  const canSubmit = status !== "loading";

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
      smsConsent: true,
      emailConsent: Boolean(String(data.get("email") ?? "").trim()),
    });

    await submitLead(payload);
    setStatus("success");
    form.reset();
    setPhotoNames([]);
    onSuccess?.();
  }

  if (status === "success") {
    return (
      <p
        role="status"
        className={styles.success}
      >
        {quoteSuccessMessage}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={styles.form}>
      {status === "error" ? (
        <p
          id={ids.error}
          tabIndex={-1}
          role="alert"
          className={styles.alert}
        >
          Check the fields below before sending.
        </p>
      ) : null}

      <div className={`${styles.grid} ${compact ? "" : styles.twoColumns}`}>
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

      <div className={`${styles.grid} ${compact ? "" : styles.twoColumns}`}>
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
        <label htmlFor={ids.service} className={styles.label}>
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
          <p className={styles.error}>{errors.service}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor={ids.description} className={styles.label}>
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
          <p className={styles.error}>{errors.description}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor={ids.photos} className={styles.label}>
          Upload Photos
          <span aria-hidden="true"> *</span>
        </label>
        <p className={styles.helper}>
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
          className={styles.fileInput}
        />
        {photoNames.length > 0 ? (
          <p className={styles.fileNames}>{photoNames.join(", ")}</p>
        ) : null}
        {errors.photos ? (
          <p className={styles.error}>{errors.photos}</p>
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

      <ConsentFields />

      <button type="submit" disabled={!canSubmit} className={styles.submit}>
        {status === "loading" ? "Sending…" : ctas.quote}
      </button>
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
      <label htmlFor={id} className={styles.label}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
        {optional ? (
          <span className={styles.optional}>Optional</span>
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
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}
