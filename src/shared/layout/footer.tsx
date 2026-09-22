import Link from "next/link";
import { BrandLogo } from "@/shared/ui";
import { footerNav, legalNav, site } from "@/lib/site";
import styles from "./footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brand}>
          <BrandLogo size="footer" />
          <p className={styles.area}>{site.areaServed}</p>
        </div>
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
          <p className={styles.text}>{site.areaServed}</p>
          <p className={styles.textSecondary}>{site.availability}</p>
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
