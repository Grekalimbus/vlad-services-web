"use client";

import { Phone } from "lucide-react";
import { CallNow, QuoteCta } from "@/features/quote";
import { ctas } from "@/lib/site";
import styles from "./mobile-cta.module.css";

export function MobileCta() {
  return (
    <div className={styles.wrap}>
      <div className={styles.bar}>
        <div className={styles.grid}>
          <CallNow className={styles.call}>
            <Phone size={14} aria-hidden="true" />
            {ctas.call}
          </CallNow>
          <QuoteCta className={styles.quote}>{ctas.quote}</QuoteCta>
        </div>
      </div>
    </div>
  );
}
