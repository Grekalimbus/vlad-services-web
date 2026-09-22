import type { ReactNode } from "react";
import { Footer } from "@/components/footer";

type PageFrameProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function PageFrame({
  title,
  children,
}: PageFrameProps) {
  return (
    <div className="relative z-10 bg-background pt-[max(5.75rem,calc(env(safe-area-inset-top)+4.5rem))]">
      <header className="border-b border-border">
        <div className="container-page py-12 md:py-16">
          <h1 className="text-4xl font-medium tracking-[-0.03em] md:text-5xl">
            {title}
          </h1>
        </div>
      </header>
      <main id="content">{children}</main>
      <Footer />
    </div>
  );
}
