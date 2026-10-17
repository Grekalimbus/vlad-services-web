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
  light?: boolean;
};

export function PageFrame({
  title,
  hero,
  children,
  flush = false,
  light = false,
}: PageFrameProps) {
  const pageClass = [styles.page, flush ? styles.pageFlush : "", light ? styles.pageLight : ""]
    .filter(Boolean)
    .join(" ");
  const headerClass = light ? styles.headerLight : flush ? styles.headerFlush : styles.header;

  return (
    <div className={pageClass}>
      <header className={headerClass}>
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
