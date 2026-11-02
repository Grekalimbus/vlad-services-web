"use client";

import Image from "next/image";
import { useState } from "react";
import { addDeal } from "@/features/editor/deal-actions";
import { dealsPage } from "@/lib/cms/deals-page";
import { useCms, useEditing } from "@/lib/cms/use-cms";
import { assetPath } from "@/lib/site";
import { PageFrame } from "@/shared/layout";
import styles from "./deals-page.module.css";

export function DealsPageView() {
  const cms = useCms();
  const editing = useEditing();
  const page = dealsPage(cms);
  const [active, setActive] = useState(0);
  const index = page.items.length === 0 ? 0 : Math.min(active, page.items.length - 1);
  const deal = page.items[index];

  return (
    <PageFrame light flush eyebrow="Deals" title={page.title} hero={<></>}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <h1 className={styles.pageTitle} data-cms="copy.dealsPage.title">
            {page.title}
          </h1>
          <ul className={styles.nav} aria-label="Deals">
            {page.items.map((item, itemIndex) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={styles.item}
                  aria-current={itemIndex === index ? "true" : undefined}
                  onClick={() => setActive(itemIndex)}
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
          {editing ? (
            <button
              type="button"
              className={styles.add}
              onClick={() => {
                addDeal();
                setActive(page.items.length);
              }}
            >
              New deal
            </button>
          ) : null}
        </aside>
        {deal ? (
          <article className={styles.stage}>
            <figure className={styles.mediaHit} data-cms-card={`deal:${index}`}>
              {deal.kind === "video" ? (
                <video
                  key={deal.media}
                  className={styles.media}
                  src={assetPath(deal.media)}
                  controls
                  playsInline
                  data-cms-src={`copy.dealsPage.items.${index}.media`}
                />
              ) : (
                <Image
                  src={assetPath(deal.media)}
                  alt={deal.alt || deal.title}
                  data-cms-alt={`copy.dealsPage.items.${index}.alt`}
                  width={700}
                  height={400}
                  priority={index === 0}
                  unoptimized={deal.media.startsWith("/api/media/")}
                  className={styles.media}
                  data-cms-src={`copy.dealsPage.items.${index}.media`}
                />
              )}
            </figure>
            <h2 className={styles.title} data-cms={`copy.dealsPage.items.${index}.title`}>
              {deal.title}
            </h2>
            <p className={styles.text} data-cms={`copy.dealsPage.items.${index}.text`}>
              {deal.text}
            </p>
          </article>
        ) : (
          <p className={styles.empty}>No deals yet.</p>
        )}
      </div>
    </PageFrame>
  );
}
