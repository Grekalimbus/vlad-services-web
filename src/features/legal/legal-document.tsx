import { legalNav, site } from "@/lib/site";
import type { LegalPage } from "@/lib/legal";
import Link from "next/link";
import styles from "./legal-document.module.css";

export function LegalDocument({ page }: { page: LegalPage }) {
  return (
    <article className={styles.legal}>
      <p className={styles.muted}>
        Placeholder content. Final legal wording will be inserted here without changing this
        page structure.
      </p>
      <p className={styles.intro}>{page.intro}</p>
      <div className={styles.sections}>
        {page.sections.map((section) => (
          <section key={section.id} aria-labelledby={section.id}>
            <h2 id={section.id} className={styles.heading}>
              {section.heading}
            </h2>
            <p className={styles.body}>{section.body}</p>
          </section>
        ))}
      </div>
      <p className={styles.questions}>
        Questions:{" "}
        <a href={`mailto:${site.email}`} className={styles.email}>
          {site.email}
        </a>
      </p>
      <nav className={styles.nav} aria-label="Legal">
        {legalNav.map((item) => (
          <Link key={item.href} href={item.href} className={styles.link}>
            {item.label}
          </Link>
        ))}
      </nav>
    </article>
  );
}
