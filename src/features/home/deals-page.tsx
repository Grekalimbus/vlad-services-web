"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useState } from "react";
import { addDeal } from "@/features/editor/deal-actions";
import { dealsPage } from "@/lib/cms/deals-page";
import { useCms, useEditing } from "@/lib/cms/use-cms";
import { assetPath, routes } from "@/lib/site";
import { PageFrame } from "@/shared/layout";
import styles from "./deals-page.module.css";

/** Fixed deal → service order (by sidebar position). */
const DEAL_SERVICE_LINKS = [
  { slug: "tv-mounting", label: "TV Mounting" },
  { slug: "electrical", label: "Electrical" },
  { slug: "handyman", label: "Handyman" },
  { slug: "landscaper", label: "Landscaper" },
] as const;

function indexFromHash(items: { id: string }[]) {
  const id = window.location.hash.replace(/^#/, "");
  if (!id) return 0;
  const next = items.findIndex((item) => item.id === id);
  return next >= 0 ? next : 0;
}

export function DealsPageView() {
  const cms = useCms();
  const editing = useEditing();
  const page = dealsPage(cms);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const index = page.items.length === 0 ? 0 : Math.min(active, page.items.length - 1);
  const deal = page.items[index];
  const serviceLink = DEAL_SERVICE_LINKS[index];

  useLayoutEffect(() => {
    setActive(indexFromHash(page.items));
    setReady(true);
  }, [page.items]);

  useEffect(() => {
    const sync = () => setActive(indexFromHash(page.items));
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [page.items]);

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
                  onClick={() => {
                    setActive(itemIndex);
                    const url = new URL(window.location.href);
                    url.hash = item.id;
                    window.history.replaceState(null, "", url);
                  }}
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
        {!ready ? (
          <div className={styles.stage} aria-hidden="true" />
        ) : deal ? (
          <article className={styles.stage}>
            <figure className={styles.mediaHit} data-cms-card={`deal:${index}`}>
              {deal.kind === "video" ? (
                <video
                  key={deal.media || deal.id}
                  className={styles.media}
                  src={assetPath(deal.media)}
                  controls
                  playsInline
                  data-cms-src={`copy.dealsPage.items.${index}.media`}
                />
              ) : deal.media ? (
                <Image
                  key={deal.media || deal.id}
                  src={assetPath(deal.media)}
                  alt={deal.alt || deal.title}
                  data-cms-alt={`copy.dealsPage.items.${index}.alt`}
                  width={700}
                  height={400}
                  priority
                  unoptimized={deal.media.startsWith("/api/media/")}
                  className={styles.media}
                  data-cms-src={`copy.dealsPage.items.${index}.media`}
                />
              ) : (
                <div className={styles.media} aria-hidden="true" />
              )}
            </figure>
            <h2 className={styles.title} data-cms={`copy.dealsPage.items.${index}.title`}>
              {deal.title}
            </h2>
            <p className={styles.text} data-cms={`copy.dealsPage.items.${index}.text`}>
              {deal.text}
            </p>
            {serviceLink ? (
              <Link href={routes.service(serviceLink.slug)} className={styles.serviceLink}>
                View {serviceLink.label}
              </Link>
            ) : null}
          </article>
        ) : (
          <p className={styles.empty}>No deals yet.</p>
        )}
      </div>
    </PageFrame>
  );
}
