import { BookingForm } from "@/components/booking-form";
import { site } from "@/lib/site";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading">
      <div className="container-page grid gap-12 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-5">
          <p className="eyebrow">Contact</p>
          <h2
            id="contact-heading"
            className="mt-4 font-serif text-4xl font-medium tracking-tight md:text-5xl"
          >
            Prefer to write, or call now
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
            We answer around the clock. Leave a note if you already know the
            wall and the screen size.
          </p>
          <p className="mt-8">
            <a
              href={site.phoneHref}
              className="font-serif text-3xl tracking-tight text-foreground"
            >
              {site.phoneDisplay}
            </a>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{site.hours}</p>
        </div>
        <div className="md:col-span-7">
          <BookingForm />
        </div>
      </div>
    </section>
  );
}
