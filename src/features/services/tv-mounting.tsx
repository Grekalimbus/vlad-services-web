import Link from "next/link";
import { TvQuoteCta } from "@/features/quote";
import { PackageCards } from "./package-cards";
import { buttonPrimaryClass } from "@/lib/forms";
import { mountTypes, packagesForService, tvAddons } from "@/lib/services";
import { routes } from "@/lib/site";
import styles from "./tv-mounting.module.css";

export function TvMounting() {
  const packages = packagesForService("tv-mounting");

  return (
    <section id="tv" aria-labelledby="tv-heading" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.intro}>
          <h2 id="tv-heading" className={styles.title}>
            Mounted as if it were always there
          </h2>
          <p className={styles.description}>
            The bracket is chosen for the screen and the wall. Level, load, and cables are
            finished before we leave. Drywall, masonry, tile, and timber.
          </p>
        </div>

        <ol className={styles.mountGrid}>
          {mountTypes.map((item, index) => (
            <li key={item.id} className={styles.mountItem}>
              <p className={styles.index}>0{index + 1}</p>
              <h3 className={styles.mountTitle}>{item.title}</h3>
              <p className={styles.text}>{item.text}</p>
            </li>
          ))}
        </ol>

        <div className={styles.addonGrid}>
          {tvAddons.map((item) => (
            <article key={item.id} className={styles.addon}>
              <h3 className={styles.addonTitle}>{item.title}</h3>
              <p className={styles.text}>{item.text}</p>
            </article>
          ))}
        </div>

        <div className={styles.packages}>
          <PackageCards packages={packages} form="tv" />
        </div>

        <div className={styles.actions}>
          <TvQuoteCta className={buttonPrimaryClass} />
          <Link href={routes.service("tv-mounting")} className={styles.secondaryLink}>
            TV mounting page
          </Link>
        </div>
      </div>
    </section>
  );
}
