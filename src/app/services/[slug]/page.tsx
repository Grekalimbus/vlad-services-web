import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ProjectPhoto } from "@/features/gallery";
import { Contact, QuoteCta } from "@/features/quote";
import { Additionals, Plan, TvBand, TvGallery, TvPhotoMarquee } from "@/features/services";
import { PageFrame } from "@/shared/layout";
import { buttonPrimaryClass } from "@/lib/forms";
import { itemsInCategory } from "@/lib/gallery";
import {
  landingForSlug,
  serviceRouteSlugs,
  servicesInCategory,
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
  const photos = itemsInCategory("tv-mounting");
  const reel = photos.flatMap((entry) =>
    entry.src ? [{ id: entry.id, src: entry.src, alt: entry.alt }] : [],
  );
  return (
    <PageFrame
      flush
      eyebrow="TV Mounting"
      title="TV Mounting"
      description="Choose how many televisions you need mounted, pick a size, and tell us the wall. Concealment, a TV outlet, and all four mount types live on this page."
      hero={<TvPhotoMarquee photos={reel} />}
    >
      <Plan />
      <TvBand>
        <Additionals />
        <TvGallery />
      </TvBand>
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
