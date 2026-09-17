import { site } from "@/lib/site";
import { faqs } from "@/lib/content";
import { googleListing } from "@/lib/google-reviews";
import { featuredCategories } from "@/lib/services";
import { primaryLocation } from "@/lib/locations";

export function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HomeAndConstructionBusiness",
        "@id": `${site.url}/#business`,
        name: site.legalName,
        description: site.description,
        url: site.url,
        telephone: site.phoneHref.replace("tel:", ""),
        email: site.email,
        image: `${site.url}${site.logo}`,
        areaServed: {
          "@type": "City",
          name: primaryLocation.city,
          containedInPlace: {
            "@type": "State",
            name: "California",
          },
        },
        knowsAbout: featuredCategories.map((category) => category.name),
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: googleListing.rating,
          reviewCount: googleListing.reviewCount,
          bestRating: 5,
          worstRating: 1,
        },
      },
      {
        "@type": "Service",
        name: "TV mounting",
        serviceType: "TV mounting",
        provider: { "@id": `${site.url}/#business` },
        areaServed: site.areaServed,
      },
      {
        "@type": "Service",
        name: "Electrical",
        serviceType: "Electrical",
        provider: { "@id": `${site.url}/#business` },
        areaServed: site.areaServed,
      },
      {
        "@type": "Service",
        name: "Handyman services",
        serviceType: "Handyman",
        provider: { "@id": `${site.url}/#business` },
        areaServed: site.areaServed,
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
