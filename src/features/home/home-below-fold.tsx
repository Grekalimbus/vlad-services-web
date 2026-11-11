"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import styles from "./home-below-fold.module.css";

function SectionSkeleton({ tall = false }: { tall?: boolean }) {
  return (
    <div className={tall ? `${styles.skeleton} ${styles.skeletonTall}` : styles.skeleton} aria-hidden="true">
      <span className={styles.skeletonBar} />
      <span className={styles.skeletonBlock} />
    </div>
  );
}

const Reviews = dynamic(() => import("@/features/reviews").then((mod) => mod.Reviews), {
  loading: () => <SectionSkeleton tall />,
});
const Works = dynamic(() => import("./works").then((mod) => mod.Works), {
  loading: () => <SectionSkeleton tall />,
});
const Faq = dynamic(() => import("./faq").then((mod) => mod.Faq), {
  loading: () => <SectionSkeleton />,
});
const AreasSection = dynamic(() => import("@/features/areas").then((mod) => mod.AreasSection), {
  loading: () => <SectionSkeleton />,
});
const DealsSignup = dynamic(() => import("./deals-signup").then((mod) => mod.DealsSignup), {
  loading: () => <SectionSkeleton tall />,
});

export function HomeBelowFold({ bandClassName, atmosphere }: { bandClassName: string; atmosphere: ReactNode }) {
  return (
    <div className={styles.belowFold}>
      <Works />
      <Reviews />
      <div className={bandClassName}>
        {atmosphere}
        <Faq />
        <AreasSection id="areas" />
        <DealsSignup />
      </div>
    </div>
  );
}
