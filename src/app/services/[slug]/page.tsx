import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ProjectPhoto } from "@/features/gallery";
import { Contact, QuoteCta, TvQuoteCta } from "@/features/quote";
import { PackageCards, Plan } from "@/features/services";
import { PageFrame } from "@/shared/layout";
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
import styles from "../services.module.css";

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
      title="TV Mounting"
      description="Choose how many televisions you need mounted, pick a size, and tell us the wall. Concealment, a TV outlet, and all four mount types live on this page."
    >
      <Plan />

      <section className={styles.section}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>Screen size</p>
          <h2 className={styles.sectionHeading}>
            Common TV sizes
          </h2>
          <p className={styles.description}>
            We mount compact screens through 85&quot; and larger. Size is part of the quote so the
            bracket and the wall can be matched before the visit.
          </p>
          <ul className={styles.sizeGrid}>
            {displaySizes.map((size) => (
              <li
                key={size}
                className={styles.size}
              >
                {size.replace(" or smaller", "").replace(" or larger", "+")}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>Mount types</p>
          <h2 className={styles.sectionHeading}>
            Four ways to hang the screen
          </h2>
          <ol className={styles.fourGrid}>
            {mountTypes.map((item) => (
              <li key={item.id} className={styles.card}>
                <div className={styles.media}>
                  <Image
                    src={assetPath(item.image)}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className={styles.image}
                  />
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardText}>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.sectionCard}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>On the same visit</p>
          <h2 className={styles.sectionHeadingWide}>
            Concealment and a TV outlet
          </h2>
          <p className={styles.description}>
            Everything that belongs with the television stays on this page: hiding cords in the
            wall, covering them on the surface, and adding power behind the screen.
          </p>
          <div className={styles.threeGrid}>
            {tvAddons.map((item) => (
              <article
                key={item.id}
                className={styles.card}
              >
                <div className={styles.media}>
                  <Image
                    src={assetPath(item.image)}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className={styles.image}
                  />
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardText}>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
          <div className={styles.packages}>
            <PackageCards packages={packages} form="tv" />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.photoHeading}>
            TV mounting photos
          </h2>
          <div className={styles.photoGrid}>
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

      <section id="tv-quote" className={styles.section}>
        <div className={styles.quoteContainer}>
          <p className={styles.quoteText}>
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
      <section className={styles.section}>
        <div className={styles.compactContainer}>
          <ol className={styles.offeringGrid}>
            {offerings.map((item) => (
              <OfferingCard key={item.id} service={item} />
            ))}
          </ol>
          <div className={styles.ctaWrap}>
            <QuoteCta className={buttonPrimaryClass} />
          </div>
        </div>
      </section>

      {photos.length > 0 ? (
        <section className={styles.sectionCard}>
          <div className={styles.compactContainer}>
            <h2 className={styles.photoHeading}>
              {category.name} photos
            </h2>
            <div className={styles.photoGrid}>
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

      <Contact heading="Get Quote" defaultService={category.id} />
    </PageFrame>
  );
}

function OfferingCard({ service }: { service: Service }) {
  const media = offeringImages[service.id];
  return (
    <li className={styles.card}>
      {media ? (
        <div className={styles.media}>
          <Image
            src={assetPath(media.src)}
            alt={media.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={styles.image}
          />
        </div>
      ) : null}
      <div className={styles.cardBody}>
        <h2 className={styles.cardTitle}>{service.name}</h2>
        <p className={styles.cardText}>{service.summary}</p>
      </div>
    </li>
  );
}
