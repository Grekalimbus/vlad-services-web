import { BookService, CallNow } from "./cta";
import { QuoteForm } from "./quote-form";
import { buttonSecondaryClass } from "@/lib/forms";
import { ctas, site } from "@/lib/site";
import styles from "./contact.module.css";

export function Contact({
  heading = "Get Quote",
  formId = "general-quote",
  defaultService,
}: {
  heading?: string;
  formId?: "general-quote" | "quote-dialog";
  defaultService?: string;
}) {
  return (
    <section id="contact" aria-labelledby="contact-heading">
      <div className={styles.container}>
        <div className={styles.intro}>
          <h2 id="contact-heading" className={styles.heading}>
            {heading}
          </h2>
          <p className={styles.phoneWrap}>
            <a href={site.phoneHref} className={styles.phone}>
              {site.phoneDisplay}
            </a>
          </p>
          <p className={styles.area}>{site.areaServed}</p>
          <p className={styles.availability}>{site.availability}</p>
          <div className={styles.actions}>
            <CallNow />
            <BookService className={buttonSecondaryClass}>{ctas.book}</BookService>
          </div>
        </div>
        <div className={styles.form}>
          <QuoteForm formId={formId} defaultService={defaultService} />
        </div>
      </div>
    </section>
  );
}
