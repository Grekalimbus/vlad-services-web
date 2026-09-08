"use client";

import { useEffect, useId, useState } from "react";
import { Menu, X } from "lucide-react";
import { nav, site } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const [overHero, setOverHero] = useState(true);
  const panelId = useId();
  const inverted = overHero && !open;

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

  useEffect(() => {
    const update = () => {
      setOverHero(window.scrollY < 24);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        inverted
          ? "border-b border-white/10 bg-transparent text-white"
          : "border-b border-border bg-background text-foreground"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-[4.25rem]">
        <a href="#top" className="flex min-w-0 flex-col leading-none">
          <span className="font-serif text-[1.65rem] font-medium tracking-tight">
            {site.wordmark}
          </span>
          <span
            className={`mt-1 font-mono text-[0.62rem] font-medium tracking-[0.16em] uppercase ${
              inverted ? "text-white/70" : "text-muted-foreground"
            }`}
          >
            {site.hoursShort}
          </span>
        </a>

        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label="Primary"
        >
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`text-[0.8125rem] font-medium transition-colors duration-200 ${
                inverted ? "text-white/80 hover:text-white" : "text-secondary hover:text-foreground"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={site.phoneHref}
            className="hidden text-[0.8125rem] font-medium tracking-wide sm:inline"
          >
            {site.phoneDisplay}
          </a>
          <a
            href="#plan"
            className={
              inverted
                ? "hidden"
                : "hidden min-h-10 cursor-pointer items-center rounded-sm bg-primary px-4 text-[0.75rem] font-semibold tracking-wide text-primary-foreground transition-opacity duration-200 hover:opacity-90 sm:inline-flex"
            }
          >
            Plan a visit
          </a>
          <button
            type="button"
            className={`inline-flex size-11 cursor-pointer items-center justify-center rounded-sm border lg:hidden ${
              inverted ? "border-white/30" : "border-border"
            }`}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>

      {open ? (
        <div id={panelId} className="border-t border-border bg-background text-foreground lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-4" aria-label="Mobile">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-sm px-2 py-3 text-base font-medium"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href={site.phoneHref}
              className="mt-2 rounded-sm border border-border px-3 py-3 text-sm font-medium"
            >
              {site.phoneDisplay}
            </a>
            <a
              href="#plan"
              className="cursor-pointer rounded-sm bg-primary px-3 py-3 text-center text-sm font-semibold text-primary-foreground"
              onClick={() => setOpen(false)}
            >
              Plan a visit
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
