"use client";

import Link from "next/link";
import { useCms } from "@/lib/cms/use-cms";
import { PageFrame } from "@/shared/layout";
import policies from "./policies.json";
import styles from "./legal-document.module.css";

function PolicyBlocks({
  blocks,
}: {
  blocks: Array<{ type: string; text?: string; items?: string[] }>;
}) {
  return blocks.map((block, index) =>
    block.type === "list" ? (
      <ul key={index} className={styles.list}>
        {(block.items ?? []).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    ) : (
      <p key={index} className={styles.body}>
        {block.text}
      </p>
    ),
  );
}

export function LegalPageView({ slug }: { slug: string }) {
  const cms = useCms();
  const published = policies[slug as keyof typeof policies];
  const index = cms.legalPages.findIndex((page) => page.slug === slug);
  const page = cms.legalPages[index];
  if (!published && !page) return null;

  const title = published?.title ?? page.title;
  const email = published?.email ?? cms.site.email;

  return (
    <PageFrame
      eyebrow="Legal"
      title={title}
      titlePath={published ? undefined : `legalPages.${index}.title`}
      crumbs={[{ href: "/", label: "Home" }, { label: title }]}
    >
      <article className={styles.legal}>
        {published ? (
          <p className={styles.muted}>Effective {published.effective}</p>
        ) : (
          <p className={styles.muted}>
            <span data-cms="copy.legalNote">{cms.copy.legalNote}</span>
          </p>
        )}
        {published ? (
          <p className={styles.intro}>{published.intro}</p>
        ) : (
          <p className={styles.intro} data-cms={`legalPages.${index}.intro`}>
            {page.intro}
          </p>
        )}
        <div className={styles.sections}>
          {published
            ? published.sections.map((section) => (
                <section key={section.id} aria-labelledby={`${slug}-${section.id}`}>
                  <h2 id={`${slug}-${section.id}`} className={styles.heading}>
                    {section.heading}
                  </h2>
                  <PolicyBlocks blocks={section.blocks} />
                </section>
              ))
            : page.sections.map((section, sectionIndex) => (
                <section key={section.id} aria-labelledby={`${slug}-${section.id}`}>
                  <h2 id={`${slug}-${section.id}`} className={styles.heading} data-cms={`legalPages.${index}.sections.${sectionIndex}.heading`}>
                    {section.heading}
                  </h2>
                  <p className={styles.body} data-cms={`legalPages.${index}.sections.${sectionIndex}.body`}>
                    {section.body}
                  </p>
                </section>
              ))}
        </div>
        <p className={styles.questions}>
          Questions:{" "}
          {published ? (
            <a href={`mailto:${email}`} className={styles.email}>
              {email}
            </a>
          ) : (
            <a href={`mailto:${cms.site.email}`} className={styles.email}>
              <span data-cms="site.email">{cms.site.email}</span>
            </a>
          )}
        </p>
        <nav className={styles.nav} aria-label="Legal">
          {cms.legalNav.map((item, itemIndex) => (
            <Link key={item.href} href={item.href} className={styles.link}>
              <span data-cms={`legalNav.${itemIndex}.label`}>{item.label}</span>
            </Link>
          ))}
        </nav>
      </article>
    </PageFrame>
  );
}
