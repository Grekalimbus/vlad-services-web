import styles from "@/styles/shared.module.css";

export const fieldClass = styles.field;
export const textareaClass = styles.textarea;
export const buttonPrimaryClass = styles.primaryButton;
export const buttonSecondaryClass = styles.secondaryButton;

export const phonePattern = /^[\d+\s()-]{10,20}$/;
export const zipPattern = /^\d{5}(?:-\d{4})?$/;
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
