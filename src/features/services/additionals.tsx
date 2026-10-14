import Image from "next/image";
import { assetPath } from "@/lib/site";
import styles from "./additionals.module.css";

const cards = [
  {
    title: "Hide Wires",
    text: "Keep your setup clean and organized with professional cable management.",
    image: "/works/tv-wood-wall.jpg",
    alt: "Mounted television with the cable tucked at the wall",
    position: "72% 18%",
  },
  {
    title: "Mount Soundbar",
    text: "Enhance your audio experience with a professionally mounted soundbar.",
    image: "/works/tv-living-blue.jpg",
    alt: "Wall-mounted television with a soundbar underneath",
    position: "center 52%",
  },
  {
    title: "Tilt Mounts",
    text: "Get the perfect viewing angle with a tilting TV mount.",
    image: "/works/gallery-wall.jpg",
    alt: "Television mounted on a living room wall",
    position: "18% 42%",
  },
  {
    title: "Type Wall",
    text: "We work with all wall types including drywall, concrete, brick, and more.",
    image: "/works/hero.jpg",
    alt: "Television mounted on a stone fireplace wall",
    position: "center 58%",
  },
] as const;

export function Additionals() {
  return (
    <section className={styles.section} aria-labelledby="additionals-heading">
      <svg
        className={styles.wave}
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="none"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          d="M0,34 C280,40 460,74 720,76 C1000,78 1220,26 1440,18"
        />
      </svg>

      <div className={styles.body}>
        <div className={styles.inner}>
          <h2 id="additionals-heading" className={styles.heading}>
            Additional<span className={styles.accent}>s</span>
          </h2>
          <ul className={styles.grid}>
            {cards.map((card) => (
              <li key={card.title} className={styles.card}>
                <div className={styles.media}>
                  <Image
                    src={assetPath(card.image)}
                    alt={card.alt}
                    fill
                    sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 100vw"
                    className={styles.image}
                    style={{ objectPosition: card.position }}
                  />
                </div>
                <h3 className={styles.title}>{card.title}</h3>
                <p className={styles.text}>{card.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
