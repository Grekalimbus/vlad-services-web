import { writeFileSync } from "node:fs";
import { faqs, trustItems } from "../src/lib/content";
import { galleryCategories, galleryItems, gallerySubcategories } from "../src/lib/gallery";
import { googleListing, googleReviews } from "../src/lib/google-reviews";
import { legalPages } from "../src/lib/legal";
import { locations } from "../src/lib/locations";
import {
  concealmentOptions,
  mountTypeOptions,
  mountTypes,
  serviceCategories,
  servicePackages,
  services,
  tvAddons,
  tvCounts,
  tvSizes,
  wallTypes,
} from "../src/lib/services";
import { ctas, footerNav, legalNav, nav, site } from "../src/lib/site";

const document = {
  version: 1,
  site: {
    name: site.name,
    shortName: site.shortName,
    wordmark: site.wordmark,
    legalName: site.legalName,
    tagline: site.tagline,
    description: site.description,
    phoneDisplay: site.phoneDisplay,
    email: site.email,
    logo: site.logo,
    availability: site.availability,
    guarantee: site.guarantee,
    insured: site.insured,
    areaServed: site.areaServed,
    areaServedShort: site.areaServedShort,
    seoTitle: site.seoTitle,
    seoDescription: site.seoDescription,
    keywords: site.keywords,
  },
  ctas: {
    quote: ctas.quote,
    book: ctas.book,
    letsStart: "LET'S START",
  },
  nav: nav.map((item) => ({ href: item.href, label: item.label })),
  footerNav: footerNav.map((item) => ({ href: item.href, label: item.label })),
  legalNav: legalNav.map((item) => ({ href: item.href, label: item.label })),
  trustItems: trustItems.map((item) => ({ ...item })),
  faqs: faqs.map((item) => ({ q: item.q, a: item.a })),
  serviceCategories: serviceCategories.map((item) => ({ ...item })),
  services: services.map((item) => ({ ...item })),
  servicePackages: servicePackages.map((item) => ({ ...item })),
  tvCounts: tvCounts.map((item) => ({ ...item })),
  tvSizes: [...tvSizes],
  wallTypes: wallTypes.map((item) => ({ ...item })),
  mountTypes: mountTypes.map((item) => ({ ...item })),
  tvAddons: tvAddons.map((item) => ({ ...item })),
  concealmentOptions: concealmentOptions.map((item) => ({ ...item })),
  mountTypeOptions: mountTypeOptions.map((item) => ({ ...item })),
  galleryCategories: galleryCategories.map((item) => ({ ...item })),
  gallerySubcategories: gallerySubcategories.map((item) => ({ ...item })),
  galleryItems: galleryItems.map((item) => ({ ...item })),
  locations: locations.map((item) => ({ ...item })),
  legalPages: legalPages.map((page) => ({
    slug: page.slug,
    href: page.href,
    title: page.title,
    status: page.status,
    intro: page.intro,
    sections: page.sections.map((section) => ({ ...section })),
  })),
  googleListing: { ...googleListing },
  googleReviews: googleReviews.map((item) => ({ ...item })),
  copy: {
    home: {
      hero: {
        builder: "/hero/builder.webp",
        image: "/works/hero.jpg",
        imageAlt: "Finished living room with a wall-mounted television",
        imageNext: "/works/tv-living-blue.jpg",
        imageNextAlt: "Large wall-mounted television with a soundbar",
        slides: [
          { image: "/works/hero.jpg", alt: "Finished living room with a wall-mounted television" },
          { image: "/works/tv-living-blue.jpg", alt: "Large wall-mounted television with a soundbar" },
        ],
        line1: "Tell Us About Your Project",
        line2Lead: "& Get",
        discount: "$30",
        line2Tail: "OFF Your Service",
        tagline: "Fast Response • Same-Day Availability • High Quality Service",
        scrollLabel: "Scroll to services",
      },
      servicesHeading: "SERVICES",
      serviceCovers: [
        { id: "tv-mounting", src: "/works/hero.jpg", position: "center 34%" },
        { id: "electrical", src: "/works/chandelier-crystal.jpg", position: "center 42%" },
        { id: "handyman", src: "/works/furniture.jpg", position: "center 68%" },
      ],
      trustHeading: "WHY US?",
      reviews: {
        headingLead: "Client's",
        headingAccent: "Feedback",
        writeReview: "Review us on Google",
        countSuffix: "Google Reviews",
      },
      works: {
        headingLead: "Projects",
        headingAccent: "Completed",
        backdrop: "/works/modern-interior.jpg",
        explore: "Explore more projects",
        cards: [
          {
            title: "TV Mount",
            lines: [] as string[],
            href: "/services/tv-mounting",
            src: "/works/hero.jpg",
            alt: "Wall-mounted television in a finished living room",
            position: "center 38%",
            icon: "tv",
          },
          {
            title: "Painting",
            lines: ["Painting", "Interior & Exterior"],
            href: "/services/handyman",
            src: "/works/painting-pexels.jpg",
            alt: "Paint roller applying a fresh coat to an interior wall",
            position: "center 42%",
            icon: "paint",
          },
          {
            title: "Electrical",
            lines: [] as string[],
            href: "/services/electrical",
            src: "/works/wiring.jpg",
            alt: "Electrician working inside a wired breaker panel",
            position: "center 40%",
            icon: "zap",
          },
          {
            title: "Assembling",
            lines: [] as string[],
            href: "/services/handyman",
            src: "/works/furniture.jpg",
            alt: "Assembled sofa set in a finished room",
            position: "center 48%",
            icon: "wrench",
          },
          {
            title: "Hanging",
            lines: [] as string[],
            href: "/services/handyman",
            src: "/works/gallery-wall.jpg",
            alt: "Framed artwork hung on a living room wall",
            position: "28% 42%",
            icon: "frame",
          },
          {
            title: "Fix / Repair",
            lines: [] as string[],
            href: "/services/handyman",
            src: "/works/pexels-drywall.jpg",
            alt: "Wall repair and finishing in progress",
            position: "center 35%",
            icon: "cog",
          },
        ],
      },
      faq: { headingLead: "QUESTIONS &", headingAccent: "ANSWERS" },
      deals: {
        headingLead: "Sign Up for",
        headingAccent: "Deals",
        success: "Thank you! You're signed up for PrimeFix deals.",
        error: "Check the fields below before sending.",
        nameLabel: "Name",
        namePlaceholder: "Enter your name.",
        phoneLabel: "Phone Number",
        phonePlaceholder: "Enter a phone number.",
        zipLabel: "ZIP Code",
        zipPlaceholder: "Enter a 5-digit ZIP code.",
        emailLabel: "Email (Optional)",
        emailPlaceholder: "Enter your email",
        submit: "Sign Up",
        sending: "Sending…",
      },
    },
    tvPage: {
      eyebrow: "TV Mounting",
      title: "TV Mounting",
      description:
        "Choose how many televisions you need mounted, pick a size, and tell us the wall. Concealment, a TV outlet, and all four mount types live on this page.",
    },
    portfolio: {
      eyebrow: "Projects",
      title: "Project gallery",
      description:
        "TV mounting, electrical, and general handyman work. Browse by category.",
    },
    notFound: {
      eyebrow: "404",
      title: "Page not found",
      text: "That address is not on this site. Head home or request a quote.",
      home: "Home",
    },
    legalNote:
      "Placeholder content. Final legal wording will be inserted here without changing this page structure.",
    questionsLabel: "Questions:",
    packagePriceNote: "Pricing quoted from the project details.",
    startingAtLabel: "Starting at",
    plan: {
      headingLead: "Choose",
      headingAccent: "Your Deal",
      book: "BOOK NOW",
      labels: { "1": "1 TV", "2": "2 TVs", "3": "3 TVs", "4plus": "4+ TVs" },
    },
    additionals: {
      headingLead: "Additional",
      headingAccent: "s",
      cards: [
        {
          title: "Hide Wires",
          text: "Keep your setup clean and organized with professional cable management.",
          image: "/works/tv-wood-wall.jpg",
          alt: "Mounted television with the cable tucked at the wall",
          position: "72% 18%",
        },
        {
          title: "Mount Soundbar",
          text: "Enhance your audio experience with a professionally mounted soundbar.",
          image: "/works/tv-living-blue.jpg",
          alt: "Wall-mounted television with a soundbar underneath",
          position: "center 52%",
        },
        {
          title: "Tilt Mounts",
          text: "Get the perfect viewing angle with a tilting TV mount.",
          image: "/works/gallery-wall.jpg",
          alt: "Television mounted on a living room wall",
          position: "18% 42%",
        },
        {
          title: "Type Wall",
          text: "We work with all wall types including drywall, concrete, brick, and more.",
          image: "/works/hero.jpg",
          alt: "Television mounted on a stone fireplace wall",
          position: "center 58%",
        },
      ],
    },
    tvGallery: {
      headingLead: "TVs",
      headingAccent: "Gallery",
      book: "BOOK NOW",
      cards: [
        {
          title: "Fireplace TV Mount",
          slides: [
            { image: "/works/hero.jpg", alt: "Television mounted above a fireplace", position: "center 42%" },
            { image: "/works/tv-wood-wall.jpg", alt: "Television mounted on a wood feature wall", position: "72% 18%" },
          ],
        },
        {
          title: "Living Room TV Mount",
          slides: [
            { image: "/works/tv-living-blue.jpg", alt: "Television and soundbar mounted in a living room", position: "center 36%" },
            { image: "/works/tv-living-cream.jpg", alt: "Television mounted on a marble living room wall", position: "68% 42%" },
          ],
        },
        {
          title: "Bedroom TV Mount",
          slides: [
            { image: "/works/pexels-kitchen-tv.jpg", alt: "Bedroom interior prepared for a wall-mounted television", position: "center 48%" },
            { image: "/works/pexels-tv-black.jpg", alt: "Television in a relaxed seating area", position: "center 45%" },
          ],
        },
        {
          title: "Outdoor TV Mount",
          slides: [
            { image: "/works/gallery-wall.jpg", alt: "Wall-mounted television beside a view to the outdoors", position: "16% 40%" },
            { image: "/works/pexels-living2.jpg", alt: "Television beside tall windows opening outdoors", position: "32% 42%" },
          ],
        },
        {
          title: "Office TV Mount",
          slides: [
            { image: "/works/tv-office-wall.jpg", alt: "Television mounted on an office wall", position: "center 32%" },
            { image: "/works/interior-styled.jpg", alt: "Television at the edge of a finished interior", position: "88% 40%" },
          ],
        },
        {
          title: "Commercial TV Mount",
          slides: [
            { image: "/works/ceiling-fan-2.jpg", alt: "Television mounted in a dining and hospitality space", position: "12% 42%" },
            { image: "/works/tv-pexels.jpg", alt: "Television mounted on a brick wall for a group viewing", position: "center 40%" },
          ],
        },
      ],
    },
    offers: {
      showMore: "Show more",
      showLess: "Show less",
      photosAccent: "photos",
      book: "BOOK NOW",
      electrical: [
        {
          title: "Chandeliers & Light Fixtures",
          description:
            "Installation of chandeliers, pendants, and other interior light fixtures. Each one is hung, leveled, and wired so it sits cleanly in the finished room.",
          slides: [
            { image: "/works/pexels-bedroom-tv.jpg", alt: "Chandelier hanging in a finished room", position: "center 18%" },
            { image: "/works/chandelier-crystal.jpg", alt: "Cluster of pendant lights", position: "center 42%" },
            { image: "/works/pexels-kitchen.jpg", alt: "Kitchen island pendants and a dining fixture", position: "center 22%" },
            { image: "/works/pendant-lights.jpg", alt: "Pendant light hung from the ceiling", position: "center 28%" },
          ],
        },
        {
          title: "Ceiling Fans",
          description: "Ceiling fan mounting and replacement. The fan is hung, wired, and balanced before we leave.",
          slides: [
            { image: "/works/tv-living-cream.jpg", alt: "Ceiling fans in a finished living room", position: "center top" },
            { image: "/works/tv-living-cream.jpg", alt: "Living room with ceiling fans above the seating", position: "18% top" },
          ],
        },
        {
          title: "Outlets & Switches",
          description: "Outlets, switches, and other minor electrical work, finished on site with clean wiring.",
          slides: [
            { image: "/works/electrician.jpg", alt: "Technician completing electrical work", position: "center 40%" },
            { image: "/works/wiring.jpg", alt: "Electrical panel and wiring", position: "center 42%" },
          ],
        },
      ],
      handyman: [
        {
          title: "Furniture Assembly",
          description:
            "Assembly of household furniture, from sofas and seating to shelving and custom closet systems, built and placed in the room.",
          slides: [
            { image: "/works/furniture.jpg", alt: "Assembled sofa in a living room", position: "center 62%" },
            { image: "/works/pexels-sofa.jpg", alt: "Leather sofa after assembly", position: "center 55%" },
            { image: "/works/modern-interior.jpg", alt: "Sectional sofa placed in a finished living room", position: "center 68%" },
          ],
        },
        {
          title: "Wall Repair & Painting",
          description:
            "Patching and drywall repair, then interior painting and touch-ups so the wall is smooth and finished.",
          slides: [
            { image: "/works/pexels-drywall.jpg", alt: "Painter rolling an interior wall", position: "center 42%" },
            { image: "/works/ceiling-fan.jpg", alt: "Ladder, roller, and paint prepared for a room", position: "center 55%" },
            { image: "/works/pexels-electrician.jpg", alt: "Hand smoothing a patched wall", position: "center 50%" },
          ],
        },
        {
          title: "Hanging & Small Repairs",
          description:
            "Pictures, artwork, and mirrors hung level. Curtain rods and blinds installed or repaired, plus door and window repairs and other small jobs around the house.",
          slides: [
            { image: "/works/pexels-living3.jpg", alt: "Pictures hung on a living room wall", position: "62% 28%" },
            { image: "/works/furniture-pexels.jpg", alt: "Shelves and lights mounted on a wall", position: "center 45%" },
            { image: "/works/interior-styled.jpg", alt: "Framed artwork hung above a chair", position: "center 32%" },
          ],
        },
      ],
    },
    forms: {
      quoteTitle: "BOOK NOW",
      tvQuoteTitle: "TV Mounting Quote",
      close: "Close",
      name: "Name",
      phone: "Phone Number",
      email: "Email",
      optional: "Optional",
      zip: "ZIP Code",
      service: "Service Needed",
      servicePlaceholder: "Select a service",
      description: "Briefly describe your project",
      photos: "Upload Photos",
      photosHelp: "Photos help PrimeFix evaluate the work and estimate pricing.",
      date: "Preferred Date",
      formError: "Check the fields below before sending.",
      sending: "Sending…",
      consentBefore:
        "I agree to receive recurring marketing and follow-up text messages from PrimeFix Home & Handyman Services LLC at the phone number provided, including messages sent using automated technology. Message frequency varies. Message and data rates may apply. Consent is not a condition of purchase. Reply STOP to opt out or HELP for help. See Privacy Policy and Messaging Terms & Conditions.",
      emailConsent:
        "I'd like to receive occasional PrimeFix offers, service updates, and promotions by email. I can unsubscribe at any time.",
      privacyLabel: "Privacy Policy",
      consentAnd: "and",
      messagingLabel: "Messaging Terms & Conditions",
      consentAfter: ".",
    },
    menuOpen: "Open menu",
    menuClose: "Close menu",
  },
};

writeFileSync(
  new URL("../src/lib/cms/default-document.json", import.meta.url),
  `${JSON.stringify(document)}\n`,
);
console.log("wrote default document", JSON.stringify(document).length);
