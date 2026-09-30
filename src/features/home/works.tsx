import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cog, Frame, PaintRoller, Tv, Wrench, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { assetPath, routes } from "@/lib/site";
import styles from "./works.module.css";

const cards: {
  title: string;
  lines?: string[];
  href: string;
  src: string;
  alt: string;
  position: string;
  icon: LucideIcon;
}[] = [
  {
    title: "TV Mount",
    href: routes.portfolioCategory("tv-mounting"),
    src: "/works/hero.jpg",
    alt: "Wall-mounted television in a finished living room",
    position: "center 38%",
    icon: Tv,
  },
  {
    title: "Painting",
    lines: ["Painting", "Interior & Exterior"],
    href: routes.portfolioCategory("handyman"),
    src: "/works/painting-pexels.jpg",
    alt: "Paint roller applying a fresh coat to an interior wall",
    position: "center 42%",
    icon: PaintRoller,
  },
  {
    title: "Electrical",
    href: routes.portfolioCategory("electrical"),
    src: "/works/wiring.jpg",
    alt: "Electrician working inside a wired breaker panel",
    position: "center 40%",
    icon: Zap,
  },
  {
    title: "Assembling",
    href: routes.portfolioCategory("handyman"),
    src: "/works/furniture.jpg",
    alt: "Assembled sofa set in a finished room",
    position: "center 48%",
    icon: Wrench,
  },
  {
    title: "Hanging",
    href: routes.portfolioCategory("handyman"),
    src: "/works/gallery-wall.jpg",
    alt: "Framed artwork hung on a living room wall",
    position: "28% 42%",
    icon: Frame,
  },
  {
    title: "Fix / Repair",
    href: routes.portfolioCategory("handyman"),
    src: "/works/pexels-drywall.jpg",
    alt: "Wall repair and finishing in progress",
    position: "center 35%",
    icon: Cog,
  },
];

export function Works() {
  return (
    <section id="works" aria-labelledby="works-heading" className={styles.section}>
      <Image
        src={assetPath("/works/modern-interior.jpg")}
        alt=""
        fill
        sizes="100vw"
        quality={80}
        className={styles.backdrop}
      />
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.container}>
        <h2 id="works-heading" className={styles.heading}>
          Projects <span className={styles.headingAccent}>Completed</span>
        </h2>

        <ul className={styles.grid}>
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <li key={card.title}>
                <Link href={card.href} className={styles.card}>
                  <Image
                    src={assetPath(card.src)}
                    alt={card.alt}
                    fill
                    sizes="(min-width: 1024px) 22rem, (min-width: 720px) 45vw, 92vw"
                    className={styles.cardImage}
                    style={{ objectPosition: card.position }}
                  />
                  <span className={styles.cardShade} aria-hidden="true" />
                  <span className={styles.cardBar}>
                    <span className={styles.cardLabel}>
                      <span className={styles.icon} aria-hidden="true">
                        <Icon size={18} strokeWidth={1.75} />
                      </span>
                      <span>
                        {card.lines
                          ? card.lines.map((line) => (
                              <span key={line} className={styles.line}>
                                {line}
                              </span>
                            ))
                          : card.title}
                      </span>
                    </span>
                    <span className={styles.arrow} aria-hidden="true">
                      <ArrowRight size={16} strokeWidth={1.75} />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <Link href={routes.portfolio} className={styles.projectsButton}>
          Explore more projects
        </Link>
      </div>
    </section>
  );
}
