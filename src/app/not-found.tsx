import Link from "next/link";
import { Footer } from "@/components/footer";
import { QuoteCta } from "@/components/cta";
import { buttonPrimaryClass } from "@/lib/forms";
import { routes } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="relative z-10 bg-background pt-[max(5.75rem,calc(env(safe-area-inset-top)+4.5rem))]">
      <main id="content" className="container-page py-24">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 text-4xl font-medium tracking-[-0.03em]">Page not found</h1>
        <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
          That address is not on this site. Head home or request a quote.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={routes.home}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-border px-6 text-sm font-medium"
          >
            Home
          </Link>
          <QuoteCta className={buttonPrimaryClass} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
