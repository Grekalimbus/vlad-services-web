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
        { name: "Home", href: "/" },
        { name: "Blog", href: "/blog" },
      ]}
    >
      <div className={styles.body}>
        <p>Articles are coming soon.</p>
      </div>
    </PageFrame>
  );
}
