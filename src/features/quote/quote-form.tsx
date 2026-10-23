"use client";

import { FormEvent, useEffect, useId, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone, Upload, User, List } from "lucide-react";
import { useCms } from "@/lib/cms/use-cms";
import { emailPattern, phonePattern, zipPattern } from "@/lib/forms";
import { quoteSuccessMessage, type LeadFormId } from "@/lib/leads";
import { quoteServices } from "@/lib/services";
import { routes } from "@/lib/site";
import { Checkbox } from "@/shared/ui";
import styles from "@/styles/forms.module.css";

const MAX_PHOTOS = 5;
const MAX_BYTES = 10 * 1024 * 1024;

type Status = "idle" | "loading" | "success" | "error";

type QuoteFormProps = {
  formId?: LeadFormId;
  defaultService?: string;
  compact?: boolean;
  onSuccess?: () => void;
};

export function QuoteForm({
  defaultService,
  onSuccess,
}: QuoteFormProps) {
  const ids = {
    name: useId(),
    phone: useId(),
    email: useId(),
    zip: useId(),
    service: useId(),
    photos: useId(),
    error: useId(),
    photoHelp: useId(),
  };
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [zip, setZip] = useState("");
  const [service, setService] = useState(defaultService ?? "");
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [photoError, setPhotoError] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [messaging, setMessaging] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const copy = useCms().copy.forms;
  const emailError = email.trim() && !emailPattern.test(email.trim()) ? "Enter a valid email or leave this blank." : "";
  const zipError = zip.trim() && !zipPattern.test(zip.trim()) ? "Enter a 5-digit ZIP code or leave this blank." : "";
  const ready =
    name.trim().length >= 2 &&
    phonePattern.test(phone.trim()) &&
    privacy &&
    messaging &&
    !emailError &&
    !zipError &&
    !photoError &&
    status !== "loading";

  useEffect(() => {
    const urls = photos.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [photos]);

  function addPhotos(list: File[]) {
    const next = [...photos];
    let message = "";
    for (const file of list) {
      if (next.length >= MAX_PHOTOS) {
        message = "You can upload up to 5 photos.";
        break;
      }
      const allowed = file.type === "image/jpeg" || file.type === "image/png" || file.type === "";
      if (!allowed) {
        message = "Upload JPG or PNG photos.";
        continue;
      }
      if (file.size > MAX_BYTES) {
        message = "Each photo must be 10 MB or smaller.";
        continue;
      }
      next.push(file);
    }
    setPhotos(next);
    setPhotoError(message);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready) return;
    setStatus("loading");
    setFormError("");
    const body = new FormData();
    body.set("name", name.trim());
    body.set("phone", phone.trim());
    body.set("email", email.trim());
    body.set("zip", zip.trim());
    body.set("service", service);
    body.set("privacy", "yes");
    body.set("messaging", "yes");
    photos.forEach((file) => body.append("photos", file));
    try {
      const response = await fetch("/api/applications", { method: "POST", body });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(payload?.error || "Could not send the request. Try again.");
      setStatus("success");
      onSuccess?.();
    } catch (error) {
      setStatus("error");
      setFormError(error instanceof Error ? error.message : "Could not send the request. Try again.");
    }
  }

  if (status === "success") {
    return (
      <p role="status" className={styles.success}>
        {quoteSuccessMessage}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={styles.bookForm}>
      {status === "error" ? (
        <p id={ids.error} tabIndex={-1} role="alert" className={styles.alert}>
          {formError || copy.formError}
        </p>
      ) : null}

      <div className={styles.bookGrid}>
        <Field
          id={ids.name}
          name="name"
          label="Name"
          required
          icon={<User size={16} aria-hidden="true" />}
          value={name}
          autoComplete="name"
          placeholder="Enter your name"
          onChange={setName}
        />
        <Field
          id={ids.phone}
          name="phone"
          label="Phone Number"
          required
          type="tel"
          inputMode="tel"
          icon={<Phone size={16} aria-hidden="true" />}
          value={phone}
          autoComplete="tel"
          placeholder="(619) 736-3016"
          onChange={setPhone}
          onBlur={() => setPhoneTouched(true)}
          error={phoneTouched && phone.trim() && !phonePattern.test(phone.trim()) ? "Enter a phone number." : ""}
        />
        <Field
          id={ids.email}
          name="email"
          label="Email"
          optional
          type="email"
          icon={<Mail size={16} aria-hidden="true" />}
          value={email}
          autoComplete="email"
          placeholder="Enter your email"
          onChange={setEmail}
          error={emailError}
        />
        <Field
          id={ids.zip}
          name="zip"
          label="ZIP Code"
          optional
          inputMode="numeric"
          icon={<MapPin size={16} aria-hidden="true" />}
          value={zip}
          autoComplete="postal-code"
          placeholder="Enter ZIP code"
          onChange={setZip}
          error={zipError}
        />

        <div className={styles.bookSpan}>
          <label htmlFor={ids.service} className={styles.bookLabel}>
            Service Needed <span className={styles.bookOptional}>Optional</span>
          </label>
          <div className={styles.bookControl}>
            <List size={16} aria-hidden="true" className={styles.bookIcon} />
            <select
              id={ids.service}
              name="service"
              value={service}
              onChange={(event) => setService(event.target.value)}
              className={styles.bookSelect}
            >
              <option value="">Select a service</option>
              {quoteServices.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.bookSpan}>
          <label htmlFor={ids.photos} className={styles.bookLabel}>
            Upload Photos <span className={styles.bookOptional}>Optional</span>
          </label>
          <label
            htmlFor={ids.photos}
            className={styles.bookDrop}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              addPhotos(Array.from(event.dataTransfer.files));
            }}
          >
            <Upload size={22} aria-hidden="true" />
            <span>
              <span className={styles.bookDropAction}>Click to upload</span> or drag and drop
            </span>
            <span id={ids.photoHelp} className={styles.bookDropHelp}>
              You can add multiple images. JPG, PNG up to 10MB each.
            </span>
          </label>
          <input
            id={ids.photos}
            name="photos"
            type="file"
            accept="image/jpeg,image/png"
            multiple
            className={styles.bookFile}
            aria-describedby={ids.photoHelp}
            onChange={(event) => {
              addPhotos(Array.from(event.target.files ?? []));
              event.target.value = "";
            }}
          />
          {photoError ? <p className={styles.error}>{photoError}</p> : null}
          {photos.length > 0 ? (
            <ul className={styles.bookPreviews}>
              {photos.map((file, index) => (
                <li key={`${file.name}-${file.lastModified}-${index}`}>
                  {previews[index] ? <img src={previews[index]} alt="" /> : null}
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setPhotos((current) => current.filter((_, item) => item !== index))}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <fieldset className={styles.bookChecks}>
        <legend className={styles.srOnly}>Agreements</legend>
        <Checkbox name="privacy" checked={privacy} onChange={(event) => setPrivacy(event.target.checked)}>
          I agree to the{" "}
          <Link href={routes.privacy} className={styles.consentLink} target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </Link>
          <span aria-hidden="true"> *</span>
        </Checkbox>
        <Checkbox name="messaging" checked={messaging} onChange={(event) => setMessaging(event.target.checked)}>
          I agree to the{" "}
          <Link href={routes.messagingTerms} className={styles.consentLink} target="_blank" rel="noopener noreferrer">
            Messaging Terms & Conditions
          </Link>
          <span aria-hidden="true"> *</span>
        </Checkbox>
      </fieldset>

      <button type="submit" className={styles.bookSubmit} disabled={!ready}>
        {status === "loading" ? "Sending…" : "BOOK NOW"}
        {status === "loading" ? null : <ArrowRight size={18} aria-hidden="true" />}
      </button>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  required = false,
  optional = false,
  type = "text",
  inputMode,
  icon,
  value,
  autoComplete,
  placeholder,
  onChange,
  onBlur,
  error,
}: {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  type?: string;
  inputMode?: "tel" | "numeric";
  icon: ReactNode;
  value: string;
  autoComplete?: string;
  placeholder: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={styles.bookLabel}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
        {optional ? <span className={styles.bookOptional}>Optional</span> : null}
      </label>
      <div className={styles.bookControl}>
        <span className={styles.bookIcon}>{icon}</span>
        <input
          id={id}
          name={name}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          aria-invalid={Boolean(error)}
          required={required}
          className={styles.bookInput}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
        />
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}
