"use client";

import { useCms } from "@/lib/cms/use-cms";
import { PageFrame } from "@/shared/layout";
import styles from "./simple-page.module.css";

export function AreasPageView() {
  const cms = useCms();
  const locations = cms.locations.filter((item) => item.status === "active");

  return (
    <PageFrame
      light
      eyebrow="Service areas"
      title="Areas"
      description={`PrimeFix serves ${cms.site.areaServed}.`}
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/areas", label: "Areas" },
      ]}
    >
      <div className={styles.body}>
        <ul className={styles.list}>
          {locations.map((location) => (
            <li key={location.id}>{location.label || location.city}</li>
          ))}
        </ul>
      </div>
    </PageFrame>
  );
}
