import type { ReactNode } from "react";
import { Footer } from "./footer";
import styles from "./page-frame.module.css";

type PageFrameProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function PageFrame({
  title,
  children,
}: PageFrameProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.title}>{title}</h1>
        </div>
      </header>
      <main id="content">{children}</main>
      <Footer />
    </div>
  );
}
