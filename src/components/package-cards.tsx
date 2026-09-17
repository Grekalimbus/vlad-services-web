import { QuoteCta, TvQuoteCta } from "@/components/cta";
import { buttonPrimaryClass } from "@/lib/forms";
import { formatStartingAt, type ServicePackage } from "@/lib/services";

export function PackageCards({
  packages,
  form = "quote",
}: {
  packages: ServicePackage[];
  form?: "quote" | "tv";
}) {
  if (packages.length === 0) return null;

  return (
    <ul className="grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-2">
      {packages.map((item) => (
        <li key={item.id} className="bg-background p-7 md:p-9">
          <h3 className="text-2xl font-medium tracking-[-0.02em]">{item.name}</h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.summary}</p>
          {item.startingAt != null ? (
            <p className="mt-5 text-sm font-medium">
              Starting at {formatStartingAt(item.startingAt, item.currency)}
            </p>
          ) : (
            <p className="mt-5 text-sm text-muted-foreground">
              Pricing quoted from the project details.
            </p>
          )}
          <div className="mt-8">
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
