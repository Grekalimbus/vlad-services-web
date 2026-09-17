"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { QuoteCta } from "@/components/cta";
import { nav, site, ctas } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="relative z-10 flex justify-center px-4 pt-[max(1rem,env(safe-area-inset-top))] md:pt-5">
        <div className="pointer-events-auto flex items-center gap-2">
          <Link
            href="/"
            className="floating-surface flex items-center rounded-full p-0.5"
            onClick={() => setOpen(false)}
          >
            <BrandLogo priority />
            <span className="sr-only">{site.name}</span>
          </Link>

          <nav
            className="floating-surface hidden items-center rounded-full p-1.5 lg:flex"
            aria-label="Primary"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3.5 py-1.5 text-[0.8125rem] font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <a
            href={site.phoneHref}
            className="floating-surface hidden min-h-11 items-center gap-2 rounded-full px-4 text-[0.8125rem] font-medium text-foreground lg:inline-flex"
          >
            <Phone size={14} aria-hidden="true" />
            {ctas.call}
          </a>

          <QuoteCta className="hidden min-h-11 cursor-pointer items-center rounded-full bg-accent px-4 text-[0.75rem] font-medium tracking-wide text-accent-foreground shadow-[0_1px_2px_rgb(23_23_23/0.04),0_10px_24px_rgb(23_23_23/0.06)] transition-colors duration-200 hover:bg-foreground hover:text-background lg:inline-flex" />

          <button
            type="button"
            className="floating-surface inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-foreground transition-colors duration-200 hover:bg-white lg:hidden"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id={panelId}
          aria-label="Mobile"
          className="pointer-events-auto floating-surface relative z-10 mx-auto mt-2 w-[calc(100%-2rem)] max-w-xs rounded-3xl p-2 lg:hidden"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={site.phoneHref}
            className="mt-1 flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-4 text-sm font-medium text-accent-foreground"
            onClick={() => setOpen(false)}
          >
            <Phone size={15} aria-hidden="true" />
            {ctas.call}
          </a>
          <QuoteCta
            className="mt-2 flex min-h-11 w-full cursor-pointer items-center justify-center rounded-full bg-foreground px-4 text-sm font-medium text-background"
          />
        </nav>
      ) : null}
    </header>
  );
}
