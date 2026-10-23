"use client";

import { Phone } from "lucide-react";
import { CallNow, QuoteCta } from "@/features/quote";
import { phoneHref } from "@/lib/site";
import { useCms } from "@/lib/cms/use-cms";
import styles from "./mobile-cta.module.css";

export function MobileCta() {
  const cms = useCms();
  return (
    <div className={styles.wrap}>
      <div className={styles.bar}>
        <div className={styles.grid}>
          <CallNow className={styles.call}>
            <Phone size={14} aria-hidden="true" />
            <span data-cms="site.phoneDisplay">{cms.site.phoneDisplay}</span>
          </CallNow>
          <QuoteCta className={styles.quote}>
            <span data-cms="ctas.quote">{cms.ctas.quote}</span>
          </QuoteCta>
        </div>
      </div>
    </div>
  );
}
