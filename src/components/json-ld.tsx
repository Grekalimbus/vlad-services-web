import { site } from "@/lib/site";
import { faqs } from "@/lib/content";

export function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${site.url}/#business`,
        name: site.name,
        description: site.description,
        url: site.url,
        telephone: site.phoneHref.replace("tel:", ""),
        email: site.email,
        image: `${site.url}/works/hero.jpg`,
        priceRange: "$$",
        areaServed: site.areaServed,
        openingHours: "Mo-Su 00:00-23:59",
      },
      {
        "@type": "Service",
        name: "TV wall mounting",
        serviceType: "TV mounting",
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
