"use client";

import { PageFrame } from "@/shared/layout";
import styles from "./simple-page.module.css";

export function BlogPageView() {
  return (
    <PageFrame
      light
      eyebrow="Blog"
      title="Blog"
      description="Guides and project notes from PrimeFix will live here."
      crumbs={[
        { href: "/", label: "Home" },
        { label: "Blog" },
      ]}
    >
      <div className={styles.body}>
        <p>
          Articles are coming soon. In the meantime, browse our{" "}
          <a href="/#services">home services</a> or request a quote from the footer.
        </p>
      </div>
    </PageFrame>
  );
}
