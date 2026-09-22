import { QuoteCta, TvQuoteCta } from "@/features/quote";
import { buttonPrimaryClass } from "@/lib/forms";
import { formatStartingAt, type ServicePackage } from "@/lib/services";
import styles from "./package-cards.module.css";

export function PackageCards({
  packages,
  form = "quote",
}: {
  packages: ServicePackage[];
  form?: "quote" | "tv";
}) {
  if (packages.length === 0) return null;

  return (
    <ul className={styles.grid}>
      {packages.map((item) => (
        <li key={item.id} className={styles.package}>
          <h3 className={styles.title}>{item.name}</h3>
          <p className={styles.summary}>{item.summary}</p>
          {item.startingAt != null ? (
            <p className={styles.price}>
              Starting at {formatStartingAt(item.startingAt, item.currency)}
            </p>
          ) : (
            <p className={styles.priceMuted}>Pricing quoted from the project details.</p>
          )}
          <div className={styles.action}>
            {form === "tv" ? (
              <TvQuoteCta className={buttonPrimaryClass} />
            ) : (
              <QuoteCta className={buttonPrimaryClass} />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
