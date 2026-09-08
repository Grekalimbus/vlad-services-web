import { nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-page grid gap-10 py-12 md:grid-cols-12 md:py-16">
        <div className="md:col-span-5">
          <p className="font-serif text-3xl">{site.wordmark}</p>
          <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-primary-foreground/55">
            {site.hoursShort}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/70">
            {site.tagline}
          </p>
        </div>
        <nav className="md:col-span-3" aria-label="Footer">
          <p className="eyebrow">On this page</p>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:underline">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-4">
          <p className="eyebrow">Reach us</p>
          <a href={site.phoneHref} className="mt-4 block font-serif text-2xl">
            {site.phoneDisplay}
          </a>
          <a href={`mailto:${site.email}`} className="mt-2 block text-sm">
            {site.email}
          </a>
          <p className="mt-4 text-sm text-primary-foreground/70">{site.hours}</p>
        </div>
      </div>
      <div className="container-page flex flex-col gap-2 border-t border-primary-foreground/15 py-6 text-xs text-primary-foreground/55 sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p>Local development</p>
      </div>
    </footer>
  );
}
