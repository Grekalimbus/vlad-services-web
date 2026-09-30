import Link from "next/link";
import { footerNav, legalNav, site } from "@/lib/site";
import styles from "./footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={styles.dots} />
        <span className={`${styles.arc} ${styles.arcLeft}`} />
        <span className={`${styles.arc} ${styles.arcLeftInner}`} />
        <span className={`${styles.arc} ${styles.arcRight}`} />
        <span className={`${styles.arc} ${styles.arcRightInner}`} />
      </div>
      <div className={styles.inner}>
        <nav className={styles.nav} aria-label="Footer">
          <ul className={styles.list}>
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.contact}>
          <a href={site.phoneHref} className={styles.phone}>
            {site.phoneDisplay}
          </a>
          <a href={`mailto:${site.email}`} className={styles.email}>
            {site.email}
          </a>
          <p className={styles.meta}>
            {site.areaServed}
            <span aria-hidden="true"> · </span>
            {site.availability}
          </p>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <nav className={styles.legalNav} aria-label="Legal">
          {legalNav.map((item) => (
            <Link key={item.href} href={item.href} className={styles.legalLink}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
