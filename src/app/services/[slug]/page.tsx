import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Contact } from "@/components/contact";
import { PackageCards } from "@/components/package-cards";
import { PageFrame } from "@/components/page-frame";
import { Plan } from "@/components/plan";
import { ProjectPhoto } from "@/components/project-photo";
import { QuoteCta, TvQuoteCta } from "@/components/cta";
import { buttonPrimaryClass } from "@/lib/forms";
import { itemsInCategory } from "@/lib/gallery";
import {
  landingForSlug,
  mountTypes,
  packagesForService,
  serviceRouteSlugs,
  servicesInCategory,
  tvAddons,
  tvSizes,
  type Service,
  type ServiceCategory,
} from "@/lib/services";
import { assetPath, site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceRouteSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const landing = landingForSlug(slug);
  if (!landing) return {};
  return {
    title: landing.name,
    description: `${landing.summary} ${site.legalName} in ${site.areaServed}.`,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const landing = landingForSlug(slug);
  if (!landing) notFound();

  if (landing.id === "tv-mounting") return <TvMountingPage />;
  if (landing.id === "electrical") return <CategoryLandingPage category={landing} />;
  if (landing.id === "handyman") return <CategoryLandingPage category={landing} />;

  notFound();
}

function TvMountingPage() {
  const packages = packagesForService("tv-mounting");
  const photos = itemsInCategory("tv-mounting");
  const displaySizes = tvSizes.filter((size) => size !== "Not sure");

  return (
    <PageFrame
      eyebrow="TV Mounting"
      title="TV mounting in San Diego"
      description="Choose how many televisions you need mounted, pick a size, and tell us the wall. Concealment, a TV outlet, and all four mount types live on this page."
    >
      <Plan />

      <section className="border-b border-border">
        <div className="container-page py-20 md:py-28">
          <p className="eyebrow">Screen size</p>
          <h2 className="mt-4 text-3xl font-medium tracking-[-0.03em] md:text-4xl">
            Common TV sizes
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            We mount compact screens through 85&quot; and larger. Size is part of the quote so the
            bracket and the wall can be matched before the visit.
          </p>
          <ul className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-4 lg:grid-cols-7">
            {displaySizes.map((size) => (
              <li
                key={size}
                className="bg-background px-4 py-8 text-center text-xl font-medium tracking-[-0.03em]"
              >
                {size.replace(" or smaller", "").replace(" or larger", "+")}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="container-page py-20 md:py-28">
          <p className="eyebrow">Mount types</p>
          <h2 className="mt-4 text-3xl font-medium tracking-[-0.03em] md:text-4xl">
            Four ways to hang the screen
          </h2>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mountTypes.map((item) => (
              <li key={item.id} className="overflow-hidden rounded-sm border border-border bg-background">
                <div className="relative aspect-4/3">
                  <Image
                    src={assetPath(item.image)}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium tracking-[-0.02em]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="container-page py-20 md:py-28">
          <p className="eyebrow">On the same visit</p>
          <h2 className="mt-4 max-w-[18ch] text-3xl font-medium tracking-[-0.03em] md:text-4xl">
            Concealment and a TV outlet
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            Everything that belongs with the television stays on this page: hiding cords in the
            wall, covering them on the surface, and adding power behind the screen.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {tvAddons.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-sm border border-border bg-background"
              >
                <div className="relative aspect-4/3">
                  <Image
                    src={assetPath(item.image)}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium tracking-[-0.02em]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-14">
            <PackageCards packages={packages} form="tv" />
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="container-page py-20 md:py-28">
          <h2 className="text-3xl font-medium tracking-[-0.03em] md:text-4xl">
            TV mounting photos
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((entry) => (
              <ProjectPhoto
                key={entry.id}
                src={entry.src ?? "/works/hero.jpg"}
                alt={entry.alt}
                label={entry.title}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="tv-quote" className="border-b border-border">
        <div className="container-page flex flex-col gap-4 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <p className="max-w-xl text-base leading-7 text-muted-foreground">
            Prefer to skip the count selector? Send a TV mounting quote with a photo of the wall.
          </p>
          <TvQuoteCta className={buttonPrimaryClass} />
        </div>
      </section>
    </PageFrame>
  );
}

const offeringImages: Record<string, { src: string; alt: string }> = {
  "light-fixture-installation": {
    src: "/works/pexels-bedroom-tv.jpg",
    alt: "Chandelier installed in a finished room",
  },
  "ceiling-fan-installation": {
    src: "/works/tv-living-cream.jpg",
    alt: "Ceiling fans in a living room",
  },
  "minor-electrical": {
    src: "/works/electrician.jpg",
    alt: "Technician completing electrical work",
  },
  "furniture-assembly": {
    src: "/works/furniture.jpg",
    alt: "Assembled sofa in a living room",
  },
  "picture-hanging": {
    src: "/works/furniture-pexels.jpg",
    alt: "Items hung on a wall",
  },
  "drywall-repair": {
    src: "/works/pexels-electrician.jpg",
    alt: "Hand smoothing a patched wall",
  },
  painting: {
    src: "/works/pexels-drywall.jpg",
    alt: "Painter rolling an interior wall",
  },
  "curtain-rods-blinds": {
    src: "/works/pexels-living3.jpg",
    alt: "Living room with hanging and window treatments",
  },
  "door-window-repairs": {
    src: "/works/pexels-kitchen.jpg",
    alt: "Finished kitchen with doors and windows",
  },
  "custom-closet": {
    src: "/works/laundry.jpg",
    alt: "Organized storage in a laundry room",
  },
  "general-handyman": {
    src: "/works/ceiling-fan.jpg",
    alt: "Tools set out for a home repair visit",
  },
};

function CategoryLandingPage({ category }: { category: ServiceCategory }) {
  const offerings = servicesInCategory(category.id);
  const photos = itemsInCategory(category.id);

  return (
    <PageFrame eyebrow="Services" title={category.name} description={category.summary}>
      <section className="border-b border-border">
        <div className="container-page py-16 md:py-24">
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {offerings.map((item) => (
              <OfferingCard key={item.id} service={item} />
            ))}
          </ol>
          <div className="mt-10">
            <QuoteCta className={buttonPrimaryClass} />
          </div>
        </div>
      </section>

      {photos.length > 0 ? (
        <section className="border-b border-border bg-card">
          <div className="container-page py-16 md:py-24">
            <h2 className="text-3xl font-medium tracking-[-0.03em] md:text-4xl">
              {category.name} photos
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((entry) => (
                <ProjectPhoto
                  key={entry.id}
                  src={entry.src ?? ""}
                  alt={entry.alt}
                  label={entry.title}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <Contact heading="Get a free quote" defaultService={category.id} />
    </PageFrame>
  );
}

function OfferingCard({ service }: { service: Service }) {
  const media = offeringImages[service.id];
  return (
    <li className="overflow-hidden rounded-sm border border-border bg-background">
      {media ? (
        <div className="relative aspect-4/3">
          <Image
            src={assetPath(media.src)}
            alt={media.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="p-6">
        <h2 className="text-xl font-medium tracking-[-0.02em]">{service.name}</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{service.summary}</p>
      </div>
    </li>
  );
}
