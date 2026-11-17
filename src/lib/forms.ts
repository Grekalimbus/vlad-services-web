import styles from "@/styles/shared.module.css";

export const fieldClass = styles.field;
export const buttonPrimaryClass = styles.primaryButton;
export const buttonSecondaryClass = styles.secondaryButton;

/** Digits only; no upper length cap on the client. */
export const phonePattern = /^\d{7,}$/;
export const zipPattern = /^\d{5}$/;
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Keep only digits for phone inputs (no hard max length). */
export function sanitizePhoneInput(value: string) {
  return value.replace(/\D/g, "");
}

/** Keep only digits for ZIP inputs (5-digit US ZIP). */
export function sanitizeZipInput(value: string) {
  return value.replace(/\D/g, "").slice(0, 5);
}

/** Block non-digit keystrokes on phone and ZIP fields (paste still goes through onChange sanitize). */
export function allowDigitsOnlyInput(event: { nativeEvent: Event; preventDefault: () => void }) {
  const data = (event.nativeEvent as InputEvent).data;
  if (data != null && data !== "" && /\D/.test(data)) event.preventDefault();
}
