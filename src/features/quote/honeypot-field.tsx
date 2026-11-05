"use client";

import { useId, type Ref } from "react";
import shared from "@/styles/shared.module.css";

/** Hidden trap field for bots. Leave empty — humans never see it. */
export function HoneypotField({ inputRef }: { inputRef?: Ref<HTMLInputElement> }) {
  const id = useId();
  return (
    <div className={shared.visuallyHidden} aria-hidden="true">
      <label htmlFor={id}>Company website</label>
      <input
        ref={inputRef}
        id={id}
        type="text"
        name="company_url"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}
