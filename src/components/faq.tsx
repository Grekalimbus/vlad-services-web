import { ChevronDown } from "lucide-react";
import { faqs } from "@/lib/content";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="border-b border-border">
      <div className="container-page grid gap-12 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-4">
          <p className="eyebrow">Questions</p>
          <h2
            id="faq-heading"
            className="mt-4 max-w-[10ch] font-serif text-4xl font-medium tracking-tight md:text-5xl"
          >
            Straight answers
          </h2>
        </div>
        <div className="md:col-span-8">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group border-b border-border py-6 first:border-t"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-medium marker:content-none [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className="shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 max-w-2xl pr-8 text-sm leading-7 text-muted-foreground">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
