"use client";

import Link from "next/link";
import { useCms } from "@/lib/cms/use-cms";
import { socialLinks } from "@/lib/social";
import { phoneHref } from "@/lib/site";
import { InstagramIcon, LinkedInIcon, YelpIcon } from "@/shared/brand-icons";
import { HashLink } from "./hash-link";
import shared from "@/styles/shared.module.css";
import styles from "./footer.module.css";

const social = [
  { href: socialLinks.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: socialLinks.yelp, label: "Yelp", Icon: YelpIcon },
  { href: socialLinks.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
] as const;

export function Footer() {
  const cms = useCms();
  return (
    <footer id="footer" tabIndex={-1} className={styles.footer}>
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
            {cms.footerNav.map((item, index) =>
              /\bbook\b/i.test(item.label) ? null : (
                <li key={`${item.href}-${index}`}>
                  <HashLink href={item.href === "/portfolio" ? "/#works" : item.href} className={styles.link}>
                    <span data-cms={`footerNav.${index}.label`}>{item.label}</span>
                  </HashLink>
                </li>
              ),
            )}
          </ul>
        </nav>
        <div className={styles.contact}>
          <a href={phoneHref(cms.site.phoneDisplay)} className={styles.phone}>
            <span data-cms="site.phoneDisplay">{cms.site.phoneDisplay}</span>
          </a>
          <a href={`mailto:${cms.site.email}`} className={styles.email}>
            <span data-cms="site.email">{cms.site.email}</span>
          </a>
          <p className={styles.meta}>
            <span data-cms="site.areaServed">{cms.site.areaServed}</span>
            <span aria-hidden="true"> · </span>
            <span data-cms="site.availability">{cms.site.availability}</span>
          </p>
          <ul className={styles.social}>
            {social.map(({ href, label, Icon }) => (
              <li key={label}>
                <a href={href} className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                  <Icon className={styles.socialIcon} />
                  <span className={shared.visuallyHidden}>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>
          © {new Date().getFullYear()} <span data-cms="site.name">{cms.site.name}</span>
        </p>
        <nav className={styles.legalNav} aria-label="Legal">
          {cms.legalNav.map((item, index) => (
            <Link key={item.href} href={item.href} className={styles.legalLink}>
              <span data-cms={`legalNav.${index}.label`}>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
