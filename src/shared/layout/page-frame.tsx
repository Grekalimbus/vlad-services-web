import type { ReactNode } from "react";
import { Footer } from "./footer";
import styles from "./page-frame.module.css";

type PageFrameProps = {
  eyebrow: string;
  title: string;
  description?: string;
  hero?: ReactNode;
  children: ReactNode;
  flush?: boolean;
};

export function PageFrame({
  title,
  hero,
  children,
  flush = false,
}: PageFrameProps) {
  return (
    <div className={flush ? `${styles.page} ${styles.pageFlush}` : styles.page}>
      <header className={flush ? styles.headerFlush : styles.header}>
        {hero ?? (
          <div className={styles.headerInner}>
            <h1 className={styles.title}>{title}</h1>
          </div>
        )}
      </header>
      <main id="content">{children}</main>
      <Footer />
    </div>
  );
}
