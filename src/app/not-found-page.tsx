"use client";

import Link from "next/link";
import { Footer } from "@/shared/layout";
import { QuoteCta } from "@/features/quote";
import { buttonPrimaryClass } from "@/lib/forms";
import { useCms } from "@/lib/cms/use-cms";
import { routes } from "@/lib/site";
import styles from "./not-found.module.css";

export function NotFoundPage() {
  const copy = useCms().copy.notFound;
  return (
    <div className={styles.page}>
      <main id="content" className={styles.main}>
        <p className={styles.eyebrow} data-cms="copy.notFound.eyebrow">{copy.eyebrow}</p>
        <h1 className={styles.title} data-cms="copy.notFound.title">{copy.title}</h1>
        <p className={styles.text} data-cms="copy.notFound.text">
          {copy.text}
        </p>
        <div className={styles.actions}>
          <Link href={routes.home} className={styles.link}>
            <span data-cms="copy.notFound.home">{copy.home}</span>
          </Link>
          <QuoteCta className={buttonPrimaryClass} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
