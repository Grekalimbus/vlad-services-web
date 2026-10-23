"use client";

import type { ReactNode } from "react";
import { getPath } from "@/lib/cms/read";
import { useCms } from "@/lib/cms/use-cms";
import { Breadcrumbs, type Crumb } from "@/shared/seo/breadcrumbs";
import { Footer } from "./footer";
import styles from "./page-frame.module.css";

type PageFrameProps = {
  eyebrow: string;
  title: string;
  titlePath?: string;
  description?: string;
  descriptionPath?: string;
  crumbs?: Crumb[];
  hero?: ReactNode;
  children: ReactNode;
  flush?: boolean;
  light?: boolean;
};

export function PageFrame({
  title,
  titlePath,
  description,
  descriptionPath,
  crumbs,
  hero,
  children,
  flush = false,
  light = false,
}: PageFrameProps) {
  const cms = useCms();
  const heading = titlePath ? String(getPath(cms, titlePath) ?? title) : title;
  const summary = descriptionPath ? String(getPath(cms, descriptionPath) ?? description ?? "") : description;
  const pageClass = [styles.page, flush ? styles.pageFlush : "", light ? styles.pageLight : ""]
    .filter(Boolean)
    .join(" ");
  const headerClass = light ? styles.headerLight : flush ? styles.headerFlush : styles.header;

  return (
    <div className={pageClass}>
      <header className={headerClass}>
        {hero ?? (
          <div className={styles.headerInner}>
            {crumbs ? <Breadcrumbs items={crumbs} /> : null}
            <h1 className={styles.title} data-cms={titlePath}>
              {heading}
            </h1>
            {summary ? (
              <p className={styles.lede} data-cms={descriptionPath}>
                {summary}
              </p>
            ) : null}
          </div>
        )}
      </header>
      <main id="content">{children}</main>
      <Footer />
    </div>
  );
}
