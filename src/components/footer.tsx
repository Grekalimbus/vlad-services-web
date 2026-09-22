import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { footerNav, legalNav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-primary pb-[5.5rem] text-primary-foreground lg:pb-0">
      <div className="container-page grid gap-10 py-12 md:grid-cols-12 md:py-16">
        <div className="md:col-span-5">
          <BrandLogo size="footer" />
          <p className="mt-4 text-sm text-primary-foreground/70">{site.areaServed}</p>
        </div>
        <nav className="md:col-span-3" aria-label="Footer">
          <ul className="flex flex-col gap-2 text-sm">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-primary-foreground/80 transition-colors duration-200 hover:text-primary-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-4">
          <a
            href={site.phoneHref}
            className="block text-2xl font-medium tracking-[-0.03em] transition-colors duration-200 hover:text-accent"
          >
            {site.phoneDisplay}
          </a>
          <a
            href={`mailto:${site.email}`}
            className="mt-2 block text-sm text-primary-foreground/80 transition-colors duration-200 hover:text-primary-foreground"
          >
            {site.email}
          </a>
          <p className="mt-4 text-sm text-primary-foreground/70">{site.areaServed}</p>
          <p className="mt-2 text-sm text-primary-foreground/70">{site.availability}</p>
        </div>
      </div>
      <div className="container-page flex flex-col gap-3 border-t border-primary-foreground/15 py-6 text-xs text-primary-foreground/55 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <nav className="flex flex-col gap-2 sm:flex-row sm:gap-4" aria-label="Legal">
          {legalNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors duration-200 hover:text-primary-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
