import { BookService, CallNow } from "@/components/cta";
import { QuoteForm } from "@/components/quote-form";
import { buttonSecondaryClass } from "@/lib/forms";
import { ctas, site } from "@/lib/site";

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
      <div className="container-page grid gap-12 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-5">
          <h2
            id="contact-heading"
            className="text-4xl font-medium tracking-[-0.03em] md:text-5xl"
          >
            {heading}
          </h2>
          <p className="mt-8">
            <a
              href={site.phoneHref}
              className="text-3xl font-medium tracking-[-0.03em] text-foreground transition-colors duration-200 hover:text-accent"
            >
              {site.phoneDisplay}
            </a>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{site.areaServed}</p>
          <p className="mt-1 text-sm text-muted-foreground">{site.availability}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CallNow />
            <BookService className={buttonSecondaryClass}>{ctas.book}</BookService>
          </div>
        </div>
        <div className="md:col-span-7">
          <QuoteForm formId={formId} defaultService={defaultService} />
        </div>
      </div>
    </section>
  );
}
