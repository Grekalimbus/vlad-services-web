"use client";

import { FormEvent, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Mail, MapPin, Phone, Upload, User, List, MessageCircle } from "lucide-react";
import { PrivacyNotice } from "./consent-fields";
import { HoneypotField } from "./honeypot-field";
import { useCms } from "@/lib/cms/use-cms";
import { emailPattern, phonePattern, zipPattern } from "@/lib/forms";
import { hearAboutOptions } from "@/lib/hear-about";
import { quoteSuccessMessage } from "@/lib/leads";
import { quoteServices } from "@/lib/services";
import styles from "@/styles/forms.module.css";

const MAX_PHOTOS = 5;
const MAX_BYTES = 10 * 1024 * 1024;
const MAX_DESCRIPTION = 450;

type Status = "idle" | "loading" | "success" | "error";
type FieldKey = "name" | "phone" | "email" | "zip" | "service" | "hearAbout";

export function QuoteForm({ initialService = "" }: { initialService?: string }) {
  const ids = {
    name: useId(),
    phone: useId(),
    email: useId(),
    zip: useId(),
    hearAbout: useId(),
    service: useId(),
    description: useId(),
    photos: useId(),
    error: useId(),
    photoHelp: useId(),
  };
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState("");
  const [invalid, setInvalid] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [zip, setZip] = useState("");
  const [hearAbout, setHearAbout] = useState("");
  const [description, setDescription] = useState("");
  const preset =
    quoteServices.find((item) => item.name === initialService)?.name ??
    quoteServices.find((item) => item.name.trim() === initialService.trim())?.name ??
    "";
  const [service, setService] = useState(preset);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const previewsRef = useRef<string[]>([]);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [photoError, setPhotoError] = useState("");
  const copy = useCms().copy.forms;

  useEffect(() => {
    const urls = previewsRef;
    return () => urls.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  function clearInvalid(key: FieldKey) {
    setInvalid((current) => (current[key] ? { ...current, [key]: undefined } : current));
  }

  function rememberPhotos(next: File[]) {
    previewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    const urls = next.map((file) => URL.createObjectURL(file));
    previewsRef.current = urls;
    setPhotos(next);
    setPreviews(urls);
  }

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
    rememberPhotos(next);
    setPhotoError(message);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

    const next: Partial<Record<FieldKey, boolean>> = {};
    if (name.trim().length < 2) next.name = true;
    if (!phonePattern.test(phone.trim())) next.phone = true;
    if (!emailPattern.test(email.trim())) next.email = true;
    if (!zipPattern.test(zip.trim())) next.zip = true;
    if (!service) next.service = true;
    if (!hearAbout) next.hearAbout = true;
    setInvalid(next);
    if (Object.keys(next).length > 0 || photoError) {
      setStatus("error");
      setFormError("");
      const focusId = next.name
        ? ids.name
        : next.phone
          ? ids.phone
          : next.email
            ? ids.email
            : next.zip
              ? ids.zip
              : next.service
                ? ids.service
                : ids.hearAbout;
      document.getElementById(focusId)?.focus();
      return;
    }

    setStatus("loading");
    setFormError("");
    const body = new FormData();
    body.set("name", name.trim());
    body.set("phone", phone.trim());
    body.set("email", email.trim());
    body.set("zip", zip.trim());
    body.set("hearAbout", hearAbout);
    body.set("service", service);
    body.set("description", description.trim().slice(0, MAX_DESCRIPTION));
    body.set("company_url", honeypotRef.current?.value ?? "");
    photos.forEach((file) => body.append("photos", file));
    try {
      const response = await fetch("/api/applications", { method: "POST", body });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(payload?.error || "Could not send the request. Try again.");
      setStatus("success");
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
      <HoneypotField inputRef={honeypotRef} />
      {status === "error" && formError ? (
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
          invalid={invalid.name}
          icon={<User size={16} aria-hidden="true" />}
          value={name}
          autoComplete="name"
          placeholder="Enter your name"
          onChange={(value) => {
            setName(value);
            clearInvalid("name");
          }}
        />
        <Field
          id={ids.phone}
          name="phone"
          label="Phone Number"
          required
          invalid={invalid.phone}
          type="tel"
          inputMode="tel"
          icon={<Phone size={16} aria-hidden="true" />}
          value={phone}
          autoComplete="tel"
          placeholder="(619) 736-3016"
          onChange={(value) => {
            setPhone(value);
            clearInvalid("phone");
          }}
        />
        <Field
          id={ids.email}
          name="email"
          label="Email"
          required
          invalid={invalid.email}
          type="email"
          icon={<Mail size={16} aria-hidden="true" />}
          value={email}
          autoComplete="email"
          placeholder="Enter your email"
          onChange={(value) => {
            setEmail(value);
            clearInvalid("email");
          }}
        />
        <Field
          id={ids.zip}
          name="zip"
          label="ZIP Code"
          required
          invalid={invalid.zip}
          inputMode="numeric"
          icon={<MapPin size={16} aria-hidden="true" />}
          value={zip}
          autoComplete="postal-code"
          placeholder="Enter ZIP code"
          onChange={(value) => {
            setZip(value);
            clearInvalid("zip");
          }}
        />

        <div className={styles.bookSpan}>
          <label htmlFor={ids.service} className={styles.bookLabel}>
            Service Needed <span aria-hidden="true"> *</span>
          </label>
          <div className={styles.bookControl}>
            <List size={16} aria-hidden="true" className={styles.bookIcon} />
            <select
              id={ids.service}
              name="service"
              value={service}
              required
              aria-invalid={invalid.service || undefined}
              onChange={(event) => {
                setService(event.target.value);
                clearInvalid("service");
              }}
              className={invalid.service ? `${styles.bookSelect} ${styles.bookInvalid}` : styles.bookSelect}
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
          <label htmlFor={ids.hearAbout} className={styles.bookLabel}>
            How did you hear about us? <span aria-hidden="true"> *</span>
          </label>
          <div className={styles.bookControl}>
            <MessageCircle size={16} aria-hidden="true" className={styles.bookIcon} />
            <select
              id={ids.hearAbout}
              name="hearAbout"
              value={hearAbout}
              required
              aria-invalid={invalid.hearAbout || undefined}
              onChange={(event) => {
                setHearAbout(event.target.value);
                clearInvalid("hearAbout");
              }}
              className={invalid.hearAbout ? `${styles.bookSelect} ${styles.bookInvalid}` : styles.bookSelect}
            >
              <option value="">How did you hear about us?</option>
              {hearAboutOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.bookSpan}>
          <label htmlFor={ids.description} className={styles.bookLabel}>
            Describe <span className={styles.bookOptional}>Optional</span>
          </label>
          <textarea
            id={ids.description}
            name="description"
            value={description}
            maxLength={MAX_DESCRIPTION}
            rows={4}
            placeholder="Tell us about the job"
            className={styles.bookTextarea}
            onChange={(event) => setDescription(event.target.value.slice(0, MAX_DESCRIPTION))}
          />
          <p className={styles.bookHint}>
            {description.length}/{MAX_DESCRIPTION}
          </p>
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
                    onClick={() => rememberPhotos(photos.filter((_, item) => item !== index))}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <button type="submit" className={styles.bookSubmit}>
        {status === "loading" ? "Sending…" : "BOOK NOW"}
      </button>
      <PrivacyNotice tone="onDark" />
    </form>
  );
}

function Field({
  id,
  name,
  label,
  required = false,
  optional = false,
  invalid = false,
  type = "text",
  inputMode,
  icon,
  value,
  autoComplete,
  placeholder,
  onChange,
}: {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  invalid?: boolean;
  type?: string;
  inputMode?: "tel" | "numeric";
  icon: ReactNode;
  value: string;
  autoComplete?: string;
  placeholder: string;
  onChange: (value: string) => void;
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
          aria-invalid={invalid || undefined}
          required={required}
          className={invalid ? `${styles.bookInput} ${styles.bookInvalid}` : styles.bookInput}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  );
}
