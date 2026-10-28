"use client";

import Image from "next/image";
import { useLayoutEffect } from "react";
import { useCms } from "@/lib/cms/use-cms";
import { HashLink } from "@/shared/layout/hash-link";
import { assetPath } from "@/lib/site";
import styles from "./hero.module.css";

function syncHeroViewport() {
  const root = document.documentElement;
  const mobileQuery = window.matchMedia("(max-width: 1023px)");
  let frame = 0;
  let loops = 0;

  const clearInline = () => {
    root.style.removeProperty("--hero-viewport");
    root.style.removeProperty("--browser-bottom-inset");
    root.style.removeProperty("--mobile-cta-height");
  };

  const measure = () => {
    const section = document.getElementById("top");
    const bar = document.querySelector<HTMLElement>("[data-mobile-cta]");
    const vv = window.visualViewport;
    const barHidden = !bar || getComputedStyle(bar).display === "none";

    if (!section || !vv || vv.scale !== 1 || vv.offsetTop < 0 || !mobileQuery.matches || barHidden) {
      clearInline();
      return false;
    }

    let changed = false;
    const setProp = (name: string, value: string) => {
      if (root.style.getPropertyValue(name) === value) return;
      if (value === "0px") root.style.removeProperty(name);
      else root.style.setProperty(name, value);
      changed = true;
    };

    const barHeight = `${Math.round(bar.getBoundingClientRect().height)}px`;
    setProp("--mobile-cta-height", barHeight);

    if (window.scrollY > 4) return changed;

    const currentInset = Number.parseFloat(root.style.getPropertyValue("--browser-bottom-inset")) || 0;
    const delta = bar.getBoundingClientRect().bottom - vv.height;
    if (Math.abs(delta) > 1.5 && (delta > 0 || currentInset > 0)) {
      setProp("--browser-bottom-inset", `${Math.max(0, Math.round(currentInset + delta))}px`);
    }

    const limit = Math.min(vv.height, bar.getBoundingClientRect().top);
    const rect = section.getBoundingClientRect();
    const overflow = rect.bottom - limit;
    if (overflow > 1.5) {
      const basis = Math.round(rect.height - overflow + bar.getBoundingClientRect().height);
      setProp("--hero-viewport", `${Math.max(0, basis)}px`);
    }

    return changed;
  };

  const run = (resetBasis: boolean) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      if (resetBasis) root.style.removeProperty("--hero-viewport");
      if (measure() && loops < 4) {
        loops += 1;
        run(false);
      } else {
        loops = 0;
      }
    });
  };

  const onViewport = () => {
    if (window.scrollY > 4) return;
    run(false);
  };
  const onResize = () => run(true);

  run(true);
  mobileQuery.addEventListener("change", onResize);
  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", onResize);
  window.visualViewport?.addEventListener("resize", onViewport);
  window.visualViewport?.addEventListener("scroll", onViewport);

  return () => {
    cancelAnimationFrame(frame);
    mobileQuery.removeEventListener("change", onResize);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("orientationchange", onResize);
    window.visualViewport?.removeEventListener("resize", onViewport);
    window.visualViewport?.removeEventListener("scroll", onViewport);
    clearInline();
  };
}

export function Hero() {
  useLayoutEffect(() => syncHeroViewport(), []);
  const cms = useCms();
  const hero = cms.copy.home.hero;
  const builderSrc = hero.builder || "/hero/builder.webp";

  return (
    <section id="top" aria-labelledby="hero-heading" className={styles.section}>
      <Image
        src={assetPath("/hero/tools-background.jpg")}
        alt=""
        fill
        priority
        sizes="100vw"
        className={styles.backdrop}
      />
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.layout}>
        <div className={styles.composition}>
          <div className={styles.copy}>
            <h1 id="hero-heading" className={styles.heading}>
              <span className={styles.line} data-cms="copy.home.hero.line1">{hero.line1}</span>
              <span className={styles.line}>
                <span data-cms="copy.home.hero.line2Lead">{hero.line2Lead}</span>{" "}
                <strong className={styles.discount} data-cms="copy.home.hero.discount">{hero.discount}</strong>{" "}
                <span data-cms="copy.home.hero.line2Tail">{hero.line2Tail}</span>
              </span>
            </h1>

            <p className={styles.tagline} data-cms="copy.home.hero.tagline">
              {hero.tagline}
            </p>

            <div className={styles.actions}>
              <HashLink href="/#services" className={styles.startButton}>
                <span data-cms="ctas.letsStart">{cms.ctas.letsStart}</span>
              </HashLink>
            </div>
          </div>

          <div className={styles.figure} data-cms-photo="copy.home.hero.builder" aria-hidden="true">
            <Image
              src={assetPath(builderSrc)}
              data-cms-src="copy.home.hero.builder"
              alt=""
              width={1006}
              height={964}
              priority
              unoptimized
              className={styles.builder}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
