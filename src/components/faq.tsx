import { ChevronDown } from "lucide-react";
import { faqs } from "@/lib/content";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="border-b border-border">
      <div className="container-page py-20 md:py-28">
        <h2
          id="faq-heading"
          className="w-full text-center text-4xl font-medium tracking-[-0.03em] md:text-5xl"
        >
          QUESTIONS &amp; ANSWERS
        </h2>
        <div className="mx-auto mt-12 max-w-4xl text-center">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group border-b border-border py-6 first:border-t"
            >
              <summary className="flex cursor-pointer list-none items-center justify-center gap-4 text-center text-base font-medium marker:content-none [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className="shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
