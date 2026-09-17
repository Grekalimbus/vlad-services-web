"use client";

import { FormEvent, useId, useState } from "react";
import { ConsentFields } from "@/components/consent-fields";
import { ctas } from "@/lib/site";
import { fieldClass, phonePattern } from "@/lib/forms";
import { concealmentOptions, mountTypeOptions, tvSizes, wallTypes } from "@/lib/services";
import {
  buildLeadPayload,
  filesFromFormData,
  quoteSuccessMessage,
  submitLead,
  type LeadFormId,
} from "@/lib/leads";

type Status = "idle" | "loading" | "success" | "error";

type TvQuoteFormProps = {
  tvCount?: string;
  formId?: LeadFormId;
  compact?: boolean;
  onSuccess?: () => void;
};

type FieldErrors = {
  name?: string;
  phone?: string;
  tvCount?: string;
  tvSize?: string;
  wallType?: string;
  hasMount?: string;
  mountType?: string;
  concealment?: string;
  photos?: string;
  smsConsent?: string;
  emailConsent?: string;
};

export function TvQuoteForm({
  tvCount,
  formId = "tv-mounting-quote",
  compact = false,
  onSuccess,
}: TvQuoteFormProps) {
  const ids = {
    count: useId(),
    size: useId(),
    photos: useId(),
    name: useId(),
    phone: useId(),
    sms: useId(),
    email: useId(),
    error: useId(),
  };
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [photoName, setPhotoName] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [emailConsent, setEmailConsent] = useState(false);
  const canSubmit = smsConsent && emailConsent && status !== "loading";

  function validate(data: FormData): FieldErrors {
    const next: FieldErrors = {};
    const name = String(data.get("name") ?? "");
    const phone = String(data.get("phone") ?? "");
    const count = String(data.get("tvCount") ?? "");
    const size = String(data.get("tvSize") ?? "");
    const wallType = String(data.get("wallType") ?? "");
    const hasMount = String(data.get("hasMount") ?? "");
    const mountType = String(data.get("mountType") ?? "");
    const concealment = String(data.get("concealment") ?? "");
    const photos = filesFromFormData(data, "wallPhoto");

    if (!count) next.tvCount = "Choose how many TVs you need mounted.";
    if (!size) next.tvSize = "Choose a TV size.";
    if (!wallType) next.wallType = "Choose a wall type.";
    if (!hasMount) next.hasMount = "Tell us if you already have a mount.";
    if (!mountType) next.mountType = "Choose a mount type.";
    if (!concealment) next.concealment = "Tell us if you need cable concealment.";
    if (photos.length === 0) next.photos = "Upload a photo of the wall.";
    if (name.trim().length < 2) next.name = "Enter your name.";
    if (!phonePattern.test(phone.trim())) next.phone = "Enter a phone number.";
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
      type: "tv-mounting",
      formId,
      fields: {
        name: String(data.get("name") ?? ""),
        phone: String(data.get("phone") ?? ""),
        tvCount: String(data.get("tvCount") ?? ""),
        tvSize: String(data.get("tvSize") ?? ""),
        wallType: String(data.get("wallType") ?? ""),
        hasMount: String(data.get("hasMount") ?? ""),
        mountType: String(data.get("mountType") ?? ""),
        concealment: String(data.get("concealment") ?? ""),
      },
      photos: filesFromFormData(data, "wallPhoto"),
      smsConsent: data.get("smsConsent") === "on",
      emailConsent: data.get("emailConsent") === "on",
    });

    await submitLead(payload);
    setStatus("success");
    form.reset();
    setPhotoName("");
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
          Check the TV mounting details below and both consent boxes before sending.
        </p>
      ) : null}

      {tvCount ? (
        <input type="hidden" name="tvCount" value={tvCount} />
      ) : (
        <div>
          <label htmlFor={ids.count} className="text-sm font-medium">
            How many TVs do you need mounted?
            <span aria-hidden="true"> *</span>
          </label>
          <select id={ids.count} name="tvCount" required className={fieldClass} defaultValue="">
            <option value="" disabled>
              Select a count
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4plus">4 or more</option>
          </select>
          {errors.tvCount ? (
            <p className="mt-2 text-sm text-destructive">{errors.tvCount}</p>
          ) : null}
        </div>
      )}

      <div>
        <label htmlFor={ids.size} className="text-sm font-medium">
          TV size
          <span aria-hidden="true"> *</span>
        </label>
        <select id={ids.size} name="tvSize" required className={fieldClass} defaultValue="">
          <option value="" disabled>
            Select a size
          </option>
          {tvSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        {errors.tvSize ? (
          <p className="mt-2 text-sm text-destructive">{errors.tvSize}</p>
        ) : null}
      </div>

      <fieldset>
        <legend className="text-sm font-medium">
          Wall type
          <span aria-hidden="true"> *</span>
        </legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {wallTypes.map((item) => (
            <label
              key={item.id}
              className="flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-input bg-background px-3 text-center text-sm has-[:checked]:border-foreground has-[:checked]:bg-foreground has-[:checked]:text-background"
            >
              <input type="radio" name="wallType" value={item.id} className="sr-only" />
              {item.label}
            </label>
          ))}
        </div>
        {errors.wallType ? (
          <p className="mt-2 text-sm text-destructive">{errors.wallType}</p>
        ) : null}
      </fieldset>

      <ChoiceRow
        legend="Do you already have a TV mount?"
        name="hasMount"
        options={[
          { id: "yes", label: "Yes" },
          { id: "no", label: "No" },
        ]}
        error={errors.hasMount}
      />

      <ChoiceRow
        legend="Which mount type?"
        name="mountType"
        options={mountTypeOptions.map((item) => ({ id: item.id, label: item.label }))}
        error={errors.mountType}
      />

      <ChoiceRow
        legend="Cable concealment"
        name="concealment"
        options={concealmentOptions.map((item) => ({ id: item.id, label: item.label }))}
        error={errors.concealment}
      />

      <div>
        <label htmlFor={ids.photos} className="text-sm font-medium">
          Upload a photo of the wall
          <span aria-hidden="true"> *</span>
        </label>
        <p className="mt-1 text-xs text-muted-foreground">
          A wall photo is part of the TV mounting quote so the surface and layout can be reviewed.
        </p>
        <input
          id={ids.photos}
          name="wallPhoto"
          type="file"
          accept="image/*"
          required
          onChange={(event) => setPhotoName(event.target.files?.[0]?.name ?? "")}
          className="mt-2 w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-foreground file:px-4 file:py-2 file:text-xs file:font-medium file:text-background"
        />
        {photoName ? <p className="mt-2 text-xs text-muted-foreground">{photoName}</p> : null}
        {errors.photos ? (
          <p className="mt-2 text-sm text-destructive">{errors.photos}</p>
        ) : null}
      </div>

      <div className={`grid gap-5 ${compact ? "" : "sm:grid-cols-2"}`}>
        <div>
          <label htmlFor={ids.name} className="text-sm font-medium">
            Name
            <span aria-hidden="true"> *</span>
          </label>
          <input id={ids.name} name="name" autoComplete="name" required className={fieldClass} />
          {errors.name ? <p className="mt-2 text-sm text-destructive">{errors.name}</p> : null}
        </div>
        <div>
          <label htmlFor={ids.phone} className="text-sm font-medium">
            Phone
            <span aria-hidden="true"> *</span>
          </label>
          <input
            id={ids.phone}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            className={fieldClass}
          />
          {errors.phone ? <p className="mt-2 text-sm text-destructive">{errors.phone}</p> : null}
        </div>
      </div>

      <ConsentFields
        smsId={ids.sms}
        emailId={ids.email}
        smsChecked={smsConsent}
        emailChecked={emailConsent}
        onSmsChange={setSmsConsent}
        onEmailChange={setEmailConsent}
        smsError={errors.smsConsent}
        emailError={errors.emailConsent}
      />

      <button
        type="submit"
        disabled={!canSubmit}
        className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : ctas.quote}
      </button>
      <p className="text-xs leading-5 text-muted-foreground">
        Check both boxes to send your quote. Fields are still checked before the request is sent.
      </p>
    </form>
  );
}

function ChoiceRow({
  legend,
  name,
  options,
  error,
}: {
  legend: string;
  name: string;
  options: { id: string; label: string }[];
  error?: string;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium">
        {legend}
        <span aria-hidden="true"> *</span>
      </legend>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((option) => (
          <label
            key={option.id}
            className="flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-input bg-background px-3 text-center text-sm has-[:checked]:border-foreground has-[:checked]:bg-foreground has-[:checked]:text-background"
          >
            <input type="radio" name={name} value={option.id} className="sr-only" />
            {option.label}
          </label>
        ))}
      </div>
      {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
    </fieldset>
  );
}
