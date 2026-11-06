"use client";

import Link from "next/link";
import { serviceAreas } from "@/features/areas/areas";
import { useCms } from "@/lib/cms/use-cms";
import { servicePageHref } from "@/lib/services";
import { PageFrame } from "@/shared/layout";
import styles from "./simple-page.module.css";

export function AreasPageView() {
  const cms = useCms();
  const locations = cms.locations.filter((item) => item.status === "active");
  const areaLabel = cms.site.areaServed || "San Diego and surrounding areas";
  const shortArea = cms.site.areaServedShort || "San Diego";
  const sanDiegoCities =
    serviceAreas.find((region) => region.id === "san-diego")?.cities.map((city) => city.label) ?? [];
  const services = cms.serviceCategories.filter(
    (category) => category.featured && category.status === "active",
  );

  return (
    <PageFrame
      light
      eyebrow="Service areas"
      title={`Service Areas in ${shortArea}`}
      description={`${cms.site.shortName} serves ${areaLabel}. Request a quote for TV mounting, electrical, handyman, and related home services.`}
      crumbs={[
        { href: "/", label: "Home" },
        { label: "Service Areas" },
      ]}
    >
      <div className={styles.body}>
        <p>
          We schedule work across {areaLabel}. The list below covers the San Diego communities we
          commonly serve. If your city is nearby and not listed, still request a quote — availability
          depends on the day and the job.
        </p>

        {locations.length > 0 ? (
          <>
            <h2 className={styles.subheading}>Primary coverage</h2>
            <ul className={styles.list}>
              {locations.map((location) => (
                <li key={location.id}>{location.label || location.city}</li>
              ))}
            </ul>
          </>
        ) : null}

        {sanDiegoCities.length > 0 ? (
          <>
            <h2 className={styles.subheading}>San Diego communities</h2>
            <ul className={styles.list}>
              {sanDiegoCities.map((city) => (
                <li key={city}>{city}</li>
              ))}
            </ul>
          </>
        ) : null}

        {services.length > 0 ? (
          <>
            <h2 className={styles.subheading}>Services available in {shortArea}</h2>
            <ul className={styles.list}>
              {services.map((category) => (
                <li key={category.id}>
                  <Link href={servicePageHref(category)}>{category.name.trim()}</Link>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </PageFrame>
  );
}
