import { site } from "@/lib/site";

export const trustItems = [
  {
    id: "guarantee",
    title: "2-Year Workmanship Guarantee",
    text: "If our workmanship fails within two years, we return and set it right.",
  },
  {
    id: "response",
    title: "Fast Response & Same-Day Availability",
    text: site.availability,
  },
  {
    id: "tvs",
    title: "15,000+ TVs Mounted",
    text: "Wall mounts, concealment, and related setup across Southern California.",
  },
  {
    id: "pricing",
    title: "Upfront & Fair Pricing",
    text: "Clear pricing from the project details, with a free estimate before the visit.",
  },
] as const;

export const faqs = [
  {
    q: "What is included in a TV mounting visit?",
    a: "We fit the bracket, hang the television, check level and load, connect power and HDMI, and leave the room tidy. Bring your own mount, or we can advise on one that matches the screen and the wall. In-wall or external concealment and a TV outlet can be quoted on the same visit.",
  },
  {
    q: "What kinds of TV mounts do you install?",
    a: "Four common types: a fixed mount that sits close to the wall, a tilting mount that angles down, a full-motion mount that extends and swivels, and ceiling TV mounting.",
  },
  {
    q: "How long does TV mounting take?",
    a: "A straightforward living-room mount is about an hour. Fireplace work, masonry, or in-wall concealment adds time — we say so before we start.",
  },
  {
    q: "Do you only mount televisions?",
    a: "No. The three primary services are TV mounting, electrical (fixtures, ceiling fans, outlets), and general handyman work such as furniture assembly, wall repair, painting, and hanging.",
  },
  {
    q: "How is electrical or handyman work priced?",
    a: "Cost depends on the project, scope, and materials. Send photos through the free quote form and PrimeFix will follow up with availability and pricing.",
  },
  {
    q: "Do you warrant the work?",
    a: "Two years on workmanship. If our fixings or workmanship fail in that time, we return and set it right.",
  },
  {
    q: "Where do you work?",
    a: "We serve customers across Southern California.",
  },
] as const;
