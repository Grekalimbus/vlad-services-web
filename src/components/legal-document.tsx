import { legalNav, site } from "@/lib/site";
import type { LegalPage } from "@/lib/legal";
import Link from "next/link";

export function LegalDocument({ page }: { page: LegalPage }) {
  return (
    <article className="container-page max-w-3xl py-12 md:py-16">
      <p className="text-sm text-muted-foreground">
        Placeholder content. Final legal wording will be inserted here without changing this
        page structure.
      </p>
      <p className="mt-4 text-base leading-7 text-muted-foreground">{page.intro}</p>
      <div className="mt-12 flex flex-col gap-10">
        {page.sections.map((section) => (
          <section key={section.id} aria-labelledby={section.id}>
            <h2 id={section.id} className="text-2xl font-medium tracking-[-0.02em]">
              {section.heading}
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </div>
      <p className="mt-12 text-sm text-muted-foreground">
        Questions:{" "}
        <a href={`mailto:${site.email}`} className="underline underline-offset-2">
          {site.email}
        </a>
      </p>
      <nav className="mt-10 flex flex-col gap-2 text-sm" aria-label="Legal">
        {legalNav.map((item) => (
          <Link key={item.href} href={item.href} className="text-accent">
            {item.label}
          </Link>
        ))}
      </nav>
    </article>
  );
}
