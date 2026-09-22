"use client";

import { FormEvent, useId, useState } from "react";
import { ConsentFields } from "./consent-fields";
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
import shared from "@/styles/shared.module.css";
import styles from "@/styles/forms.module.css";

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
    error: useId(),
  };
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [photoName, setPhotoName] = useState("");
  const canSubmit = status !== "loading";

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
      smsConsent: true,
      emailConsent: false,
    });

    await submitLead(payload);
    setStatus("success");
    form.reset();
    setPhotoName("");
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
          Check the TV mounting details below before sending.
        </p>
      ) : null}

      {tvCount ? (
        <input type="hidden" name="tvCount" value={tvCount} />
      ) : (
        <div>
          <label htmlFor={ids.count} className={styles.label}>
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
            <p className={styles.error}>{errors.tvCount}</p>
          ) : null}
        </div>
      )}

      <div>
        <label htmlFor={ids.size} className={styles.label}>
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
          <p className={styles.error}>{errors.tvSize}</p>
        ) : null}
      </div>

      <fieldset>
        <legend className={styles.label}>
          Wall type
          <span aria-hidden="true"> *</span>
        </legend>
        <div className={styles.choiceGrid}>
          {wallTypes.map((item) => (
            <label
              key={item.id}
              className={styles.choice}
            >
              <input type="radio" name="wallType" value={item.id} className={shared.visuallyHidden} />
              {item.label}
            </label>
          ))}
        </div>
        {errors.wallType ? (
          <p className={styles.error}>{errors.wallType}</p>
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
        <label htmlFor={ids.photos} className={styles.label}>
          Upload a photo of the wall
          <span aria-hidden="true"> *</span>
        </label>
        <p className={styles.helper}>
          A wall photo is part of the TV mounting quote so the surface and layout can be reviewed.
        </p>
        <input
          id={ids.photos}
          name="wallPhoto"
          type="file"
          accept="image/*"
          required
          onChange={(event) => setPhotoName(event.target.files?.[0]?.name ?? "")}
          className={styles.fileInput}
        />
        {photoName ? <p className={styles.fileNames}>{photoName}</p> : null}
        {errors.photos ? (
          <p className={styles.error}>{errors.photos}</p>
        ) : null}
      </div>

      <div className={`${styles.grid} ${compact ? "" : styles.twoColumns}`}>
        <div>
          <label htmlFor={ids.name} className={styles.label}>
            Name
            <span aria-hidden="true"> *</span>
          </label>
          <input id={ids.name} name="name" autoComplete="name" required className={fieldClass} />
          {errors.name ? <p className={styles.error}>{errors.name}</p> : null}
        </div>
        <div>
          <label htmlFor={ids.phone} className={styles.label}>
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
          {errors.phone ? <p className={styles.error}>{errors.phone}</p> : null}
        </div>
      </div>

      <ConsentFields />

      <button
        type="submit"
        disabled={!canSubmit}
        className={styles.submit}
      >
        {status === "loading" ? "Sending…" : ctas.quote}
      </button>
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
      <legend className={styles.label}>
        {legend}
        <span aria-hidden="true"> *</span>
      </legend>
      <div className={styles.choiceGrid}>
        {options.map((option) => (
          <label
            key={option.id}
            className={styles.choice}
          >
            <input type="radio" name={name} value={option.id} className={shared.visuallyHidden} />
            {option.label}
          </label>
        ))}
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}
    </fieldset>
  );
}
