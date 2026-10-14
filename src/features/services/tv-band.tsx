import type { ReactNode } from "react";
import styles from "./tv-band.module.css";

export function TvBand({ children }: { children: ReactNode }) {
  return (
    <div className={styles.band}>
      <div className={styles.backdrop} aria-hidden="true">
        <span className={styles.wash} />
        <span className={`${styles.arc} ${styles.arcTl}`} />
        <span className={`${styles.arc} ${styles.arcTlInner}`} />
        <span className={`${styles.arc} ${styles.arcTr}`} />
        <span className={`${styles.arc} ${styles.arcTrInner}`} />
        <span className={`${styles.arc} ${styles.arcBl}`} />
        <span className={`${styles.arc} ${styles.arcBr}`} />
        <span className={`${styles.arc} ${styles.arcBrInner}`} />
      </div>
      {children}
    </div>
  );
}
