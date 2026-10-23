"use client";

import Link from "next/link";
import { Breadcrumbs } from "@/shared/seo/breadcrumbs";
import { useCms } from "@/lib/cms/use-cms";
import { LANDING_SLUGS, areaLabel } from "@/lib/seo";
import styles from "./category-landing.module.css";

export function ServiceIntro({
  slug,
  name,
  namePath,
  summary,
  summaryPath,
}: {
  slug: string;
  name: string;
  namePath?: string;
  summary?: string;
  summaryPath?: string;
}) {
  const cms = useCms();
  const area = areaLabel(cms.site);
  const related = cms.serviceCategories.flatMap((category) => {
    if (category.slug === slug || category.status !== "active" || !category.featured) return [];
    if (!(LANDING_SLUGS as readonly string[]).includes(category.slug)) return [];
    const index = cms.serviceCategories.findIndex((item) => item.id === category.id);
    return [{ href: `/services/${category.slug}`, label: category.name, path: index >= 0 ? `serviceCategories.${index}.name` : undefined }];
  });

  return (
    <header className={styles.intro}>
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: name, labelPath: namePath }]} />
      <h1 className={styles.pageTitle}>
        <span data-cms={namePath}>{name}</span>
        <span className={styles.place}> in {area.short}</span>
      </h1>
      {summary ? (
        <p className={styles.lede} data-cms={summaryPath}>
          {summary}
        </p>
      ) : null}
      <nav aria-label="Related services" className={styles.related}>
        {related.map((item) => (
          <Link key={item.href} href={item.href}>
            <span data-cms={item.path}>{item.label}</span>
          </Link>
        ))}
        <Link href="/portfolio">Projects</Link>
      </nav>
    </header>
  );
}
