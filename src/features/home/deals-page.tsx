"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { AreasSection } from "@/features/areas";
import { addDeal } from "@/features/editor/deal-actions";
import { dealsPage } from "@/lib/cms/deals-page";
import { serviceReel } from "@/lib/cms/service-reel";
import { useCms, useEditing } from "@/lib/cms/use-cms";
import { assetPath, routes } from "@/lib/site";
import { PageFrame } from "@/shared/layout";
import { TvPhotoMarquee } from "@/features/services/tv-photo-marquee";
import { DealOfferCards } from "./deal-offer-cards";
import { DealsSignup } from "./deals-signup";
import styles from "./deals-page.module.css";

/** Fixed deal → service order (by sidebar position). */
const DEAL_SERVICE_LINKS = [
  { slug: "tv-mounting", label: "TV Mounting" },
  { slug: "electrical", label: "Electrical" },
  { slug: "handyman", label: "Handyman" },
  { slug: "landscaper", label: "Landscaper" },
] as const;

/** Map deals-page section ids to service category slugs used by the quote form. */
export function serviceSlugForDeal(dealId: string, dealIndex: number): string {
  if (dealId === "tv-mounting") return "tv-mounting";
  if (dealId === "electrical") return "electrical";
  if (dealId === "handyman") return "handyman";
  if (dealId === "landscaping" || dealId === "landscaper") return "landscaper";
  return DEAL_SERVICE_LINKS[dealIndex]?.slug ?? "";
}

const SERVICE_REEL_SLUGS = new Set(["tv-mounting", "electrical", "handyman", "landscaper"]);

/** Service deals reuse that service page's photos. Custom deals, including Outdoor, keep their own. */
function dealReelSlug(dealId: string) {
  if (dealId === "tv-mounting") return "tv-mounting";
  if (dealId === "electrical") return "electrical";
  if (dealId === "handyman") return "handyman";
  if (dealId === "landscaping" || dealId === "landscaper") return "landscaper";
  return "";
}

function splitDealLead(text: string) {
  const normalized = text.replace(/\r\n/g, "\n");
  const breakAt = normalized.indexOf("\n");
  if (breakAt < 0) return { lead: normalized, rest: "" };
  return { lead: normalized.slice(0, breakAt), rest: normalized.slice(breakAt + 1) };
}

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const index = page.items.length === 0 ? 0 : Math.min(active, page.items.length - 1);
  const deal = page.items[index];
  const description = splitDealLead(deal?.text ?? "");
  const serviceLink = DEAL_SERVICE_LINKS[index];
  const mediaClass = index === 0 ? `${styles.media} ${styles.mediaTv}` : styles.media;
  const titleClass =
    index === 2 || index === 3
      ? `${styles.title} ${styles.titleTighter}`
      : index === 1
        ? `${styles.title} ${styles.titleTight}`
        : styles.title;

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
      <div className={sidebarCollapsed ? `${styles.shell} ${styles.shellCollapsed}` : styles.shell}>
        <aside className={styles.sidebar} aria-label="Deals navigation">
          <div className={styles.sidebarInner}>
            <div className={styles.sidebarTop}>
              <h1 className={styles.pageTitle} data-cms="copy.dealsPage.title">
                {page.title}
              </h1>
              <button
                type="button"
                className={styles.collapse}
                aria-expanded={!sidebarCollapsed}
                aria-controls="deals-sidebar-nav"
                aria-label={sidebarCollapsed ? "Expand deals sidebar" : "Collapse deals sidebar"}
                onClick={() => setSidebarCollapsed((current) => !current)}
              >
                {sidebarCollapsed ? (
                  <PanelLeftOpen size={18} strokeWidth={2.2} aria-hidden="true" />
                ) : (
                  <PanelLeftClose size={18} strokeWidth={2.2} aria-hidden="true" />
                )}
              </button>
            </div>
            <ul id="deals-sidebar-nav" className={styles.nav} aria-label="Deals" hidden={sidebarCollapsed}>
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
            {editing && !sidebarCollapsed ? (
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
          </div>
        </aside>

        <div className={styles.main}>
          {ready && deal ? <DealReel index={index} /> : null}
          {!ready ? (
            <div className={styles.stage} aria-hidden="true" />
          ) : deal ? (
            <article className={styles.stage}>
              <figure className={styles.mediaHit} data-cms-card={`deal:${index}`}>
                {deal.kind === "video" ? (
                  <video
                    key={deal.media || deal.id}
                    className={mediaClass}
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
                    className={mediaClass}
                    data-cms-src={`copy.dealsPage.items.${index}.media`}
                  />
                ) : (
                  <div className={mediaClass} aria-hidden="true" />
                )}
              </figure>
              <h2 className={titleClass} data-cms={`copy.dealsPage.items.${index}.title`}>
                {deal.title}
              </h2>
              <p className={styles.text} data-cms={`copy.dealsPage.items.${index}.text`}>
                {description.lead ? <strong className={styles.lead}>{description.lead}</strong> : null}
                {description.rest}
              </p>
              <DealOfferCards
                dealIndex={index}
                cards={deal.offerCards}
                serviceSlug={serviceSlugForDeal(deal.id, index)}
              />
              {serviceLink ? (
                <Link href={routes.service(serviceLink.slug)} className={styles.serviceLink}>
                  View {serviceLink.label}
                </Link>
              ) : null}
            </article>
          ) : (
            <p className={styles.empty}>No deals yet.</p>
          )}

          {ready && deal ? (
            <div key={deal.id} className={styles.below}>
              <AreasSection id={`areas-${deal.id}`} storageKey={`primefix.areas.deals.${deal.id}`} />
              <DealsSignup id={`deals-${deal.id}`} />
            </div>
          ) : null}
        </div>
      </div>
    </PageFrame>
  );
}

function DealReel({ index }: { index: number }) {
  const cms = useCms();
  const deal = dealsPage(cms).items[index];
  if (!deal) return null;
  const slug = dealReelSlug(deal.id);
  const shared = SERVICE_REEL_SLUGS.has(slug);
  const photos = shared
    ? serviceReel(cms, slug)
    : deal.photos.flatMap((photo, photoIndex) =>
        photo.image ? [{ id: `${deal.id}-${photoIndex}`, src: photo.image, alt: photo.alt }] : [],
      );

  return (
    <div
      key={deal.id}
      className={styles.reel}
      data-cms-gallery={shared ? undefined : `slides:copy.dealsPage.items.${index}.photos`}
      data-empty={!shared && photos.length === 0 ? "" : undefined}
    >
      <TvPhotoMarquee
        photos={photos}
        label={deal.title || "Deal"}
        heading={false}
        seamless={slug === "tv-mounting"}
        plain={slug !== "tv-mounting"}
      />
    </div>
  );
}
