import Link from "next/link";
import { Footer } from "@/shared/layout";
import { QuoteCta } from "@/features/quote";
import { buttonPrimaryClass } from "@/lib/forms";
import { routes } from "@/lib/site";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <main id="content" className={styles.main}>
        <p className={styles.eyebrow}>404</p>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.text}>
          That address is not on this site. Head home or request a quote.
        </p>
        <div className={styles.actions}>
          <Link
            href={routes.home}
            className={styles.link}
          >
            Home
          </Link>
          <QuoteCta className={buttonPrimaryClass} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
