import { type InputHTMLAttributes, type ReactNode } from "react";
import styles from "./checkbox.module.css";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "children"> & {
  children: ReactNode;
  invalid?: boolean;
};

export function Checkbox({ children, className = "", invalid = false, ...props }: CheckboxProps) {
  return (
    <label className={`${styles.root} ${className}`.trim()}>
      <input {...props} type="checkbox" className={styles.input} aria-invalid={invalid || undefined} />
      <span className={`${styles.box} ${invalid ? styles.invalid : ""}`.trim()} aria-hidden="true">
        <svg viewBox="0 0 16 16" className={styles.mark}>
          <path
            d="M3.2 8.2 6.4 11.3 12.8 4.7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className={styles.text}>{children}</span>
    </label>
  );
}
