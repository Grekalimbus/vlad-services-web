import type { ReactNode } from "react";
import { Footer } from "@/components/footer";

type PageFrameProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function PageFrame({
  eyebrow,
  title,
  description,
  children,
}: PageFrameProps) {
  return (
    <div className="relative z-10 bg-background pt-[max(5.75rem,calc(env(safe-area-inset-top)+4.5rem))]">
      <header className="border-b border-border">
        <div className="container-page py-12 md:py-16">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-medium tracking-[-0.03em] md:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </header>
      <main id="content">{children}</main>
      <Footer />
    </div>
  );
}
