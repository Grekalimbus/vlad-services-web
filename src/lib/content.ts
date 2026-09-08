export const tvCounts = [
  {
    id: "1",
    count: "1",
    screens: 1,
    title: "One television",
    note: "A single wall",
    duration: "About an hour",
    follow:
      "Most visits are one screen. We take the time to get the height, the studs, and the cables quiet.",
  },
  {
    id: "2",
    count: "2",
    screens: 2,
    title: "A pair",
    note: "Two rooms",
    duration: "A morning",
    follow:
      "We set both to the same standard so the living room and the bedroom feel like one job, not two call-outs.",
  },
  {
    id: "3",
    count: "3",
    screens: 3,
    title: "Three screens",
    note: "A coordinated pass",
    duration: "A half day",
    follow:
      "Three mounts in a single visit. We sequence the rooms so dust and tools stay contained.",
  },
  {
    id: "4plus",
    count: "4+",
    screens: 4,
    title: "Four or more",
    note: "The whole house",
    duration: "Planned on site",
    follow:
      "Larger homes and suites need a short walkthrough. We confirm walls, power, and order — then the crew works through.",
  },
] as const;

export type TvCountId = (typeof tvCounts)[number]["id"];

export const mountTypes = [
  {
    id: "fixed",
    title: "Flush",
    text: "As close to the wall as the hardware allows. For rooms you face head-on.",
  },
  {
    id: "tilt",
    title: "Tilt",
    text: "A downward angle for fireplace installs or a screen set above eye line.",
  },
  {
    id: "motion",
    title: "Full-motion",
    text: "Extend and turn toward a second seat, a kitchen, or a wider room.",
  },
] as const;

export const tvExtras = [
  {
    title: "Cable concealment",
    text: "In-wall where the finish allows, or a discreet raceway when it does not.",
  },
  {
    title: "Above the fireplace",
    text: "Heat, glare, and reach are planned before a single hole is made.",
  },
  {
    title: "Soundbar",
    text: "Mounted under the screen and wired so the shelf stays empty.",
  },
] as const;

export const works = [
  {
    src: "/works/hero.jpg",
    alt: "Large television and soundbar mounted above a marble fireplace",
    caption: "Marble surround · soundbar · hidden cables",
  },
  {
    src: "/works/tv-wall.jpg",
    alt: "Television on an accent wall with a full-motion mount",
    caption: "Accent wall · full-motion",
  },
  {
    src: "/works/tv-fireplace.jpg",
    alt: "Bright living room after a clean installation visit",
    caption: "Living room · finished visit",
  },
  {
    src: "/works/hero-c.jpg",
    alt: "Finished living room with ordered furniture and open glass doors",
    caption: "Finished room · no visible trace of the visit",
  },
] as const;

export const faqs = [
  {
    q: "What is included in a wall-mount visit?",
    a: "We fit the bracket, hang the television, check level and load, connect power and HDMI, and leave the room tidy. Bring your own mount, or we specify one that matches the screen and the wall.",
  },
  {
    q: "How long does it take?",
    a: "A straightforward living-room mount is about an hour. Fireplace work, tile, or in-wall concealment adds time — we say so before we start.",
  },
  {
    q: "Can you mount on drywall without hitting a stud?",
    a: "Yes, with the right anchors for the weight, or we find the timber behind. Concrete, brick, and timber get their own fixings.",
  },
  {
    q: "Do you warrant the work?",
    a: "Three years on workmanship. If our fixings fail in that time, we return and set it right.",
  },
  {
    q: "Are you only television mounting?",
    a: "That is the work most people call for. Outlets behind the screen, a soundbar, or a move to another wall can be done in the same visit when it makes sense.",
  },
] as const;
