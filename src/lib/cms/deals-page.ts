import type { CmsDocument } from "./types";

export type DealItem = {
  id: string;
  title: string;
  text: string;
  media: string;
  kind: "image" | "video";
  alt: string;
};

export type DealsPageCopy = {
  title: string;
  items: DealItem[];
};

const defaultDeals: DealItem[] = [
  {
    id: "tv-mounting",
    title: "TV Mounting",
    text: "A leveled television mount on the wall you choose, with the cables tucked away and the picture checked before we leave. Same-day visits are open when a technician is nearby. The price we agree on the call is the price for the job, and that number does not change once the work matches what we discussed.\n\nMost homes need a standard fixed or tilting mount on drywall with wood studs. We find the studs, set the height for the seats you actually use, and center the screen on the wall, the fireplace, or the furniture under it. The television is lifted with two people when the size calls for it, then locked to the mount and tested for tilt, power, and picture. If you want the screen pulled out and turned toward the kitchen or the bed, say so on the call and we bring a full-motion arm rated for that weight.\n\nCable hiding is part of the visit when you ask for it. An external concealer is a paintable channel on the face of the wall. In-wall concealment routes the power and signal cables inside the wall between the screen and the outlet or the device shelf. We do not open a wall that is brick, stone, or a fireplace chase without telling you first. Above a mantel, we check the heat, the mantel depth, and how far you sit, then place the screen where it can be watched without craning your neck.\n\nSoundbars, streaming boxes, game consoles, and cable boxes can go on the same visit. A soundbar can sit on the wall under the screen or ride on the mount so it moves with a full-motion arm. Devices can live on a shelf, in a cabinet, or on a small mount behind the television so the front of the room stays clear. If a new outlet is required for a clean power run, we stop and price that electrical work before any wire is pulled.\n\nUse this deal when you want one screen or several done in a single stop: living room, bedroom, office, patio cover, or the set above the fireplace. Tell us the sizes, the wall types, and whether the cables should disappear. We will quote the visit before anyone drives out. The screen is level, the mount is in a stud or a rated anchor, and the picture was on before the tools were packed.",
    media: "/works/hero.jpg",
    kind: "image",
    alt: "Television mounted above a fireplace",
  },
  {
    id: "electrical",
    title: "Electrical",
    text: "Outlets, switches, fixtures, and fans, installed and tested in one visit. If the box is loose, the circuit is overloaded, or the job needs more than a straight swap, we stop and say so before any extra work starts. The price on the call covers the scope we named. Anything new is priced in the room before we continue.\n\nA typical electrical deal is the list that has been waiting: a dead outlet in the bedroom, a switch that no longer clicks, a dimmer for the dining light, a chandelier that arrived in a box, a ceiling fan over the bed, or a GFCI that keeps tripping in the kitchen or the bath. We open the device, check the wiring, replace what is worn, and test the circuit before we put the plate back. Fixtures are hung level, fans are balanced, and covers go on square. If the old box will not hold the new weight, we say so and price a brace or a new box instead of hanging a heavy light from a tired strap.\n\nWe also handle the small runs that make a room usable. A new outlet behind the television so the cords do not crawl down the wall. A dedicated spot for a freezer, a treadmill, or a garage door opener. Under-cabinet lights, a porch fixture, a bathroom fan that actually moves air. Each of those is quoted from the distance, the wall type, and whether the panel has room. We do not guess at a buried wire. If the path is brick, a finished ceiling with no access, or a panel that is already full, you hear that before we start cutting.\n\nSafety is the point of the visit. Warm devices, scorched plates, aluminum wiring, a missing ground, or a breaker that will not reset are not patched over. We show you what we found and we either fix it in the scope or we stop. Smoke and carbon monoxide alarms can be swapped on the same stop when you want the ones that are past their date gone. Outdoor and wet-location devices get the covers and ratings those spots require.\n\nSend the list: how many devices, which rooms, and whether the power is already at the spot. Photos of the panel, the old fixture, and the wall help. We will quote the visit before a technician drives out, and we will not add surprise items at the door. When we leave, every device we touched works and the plates are back on.",
    media: "/works/pexels-electrician.jpg",
    kind: "image",
    alt: "Electrician working on a home circuit",
  },
  {
    id: "handyman",
    title: "Handyman",
    text: "The small jobs that pile up: drywall, furniture, doors, blinds, shelves, and the fixes that do not need a full crew. Tell us the list and we will quote the visit before anyone drives out. One stop can clear a hallway of pictures, a bedroom of a new bed frame, and a kitchen of a shelf that was never anchored.\n\nFurniture is the usual start. Beds, dressers, desks, bookcases, crib frames, and the flat boxes that have been in the garage since the weekend. We assemble them square, anchor tall pieces to a stud when there are children or a tip risk, and haul the packing out if you want it gone. TV furniture, media consoles, and the low boards under a mounted screen go in the same visit as the mount when you book them together. We do not leave cam locks half-turned or backs off the dressers.\n\nDoors, hardware, and the daily annoyances come next. A door that rubs, a latch that does not catch, a closer on a garage entry, new levers through the house, a towel bar that pulled out of the drywall, a toilet paper holder, a robe hook, a shower rod. We set the anchors for the wall we actually have, not the one a picture suggested. Drywall patches from old brackets, a popped nail, or a doorknob that punched the wall are filled, taped when the hole needs it, and left ready for paint. We can spot-paint if you have the can. A full room of paint is a painter visit, and we will say that instead of pretending a handyman hour covers it.\n\nShelves, curtain rods, blinds, and mirrors are measured twice. A floating shelf gets a stud or a rated anchor and a load you can actually use. A mirror over a sink is centered on the faucet, not on a guess. Blinds and shades are leveled to the window, not to a crooked old bracket. If the window is out of square we tell you before the fabric is cut or the headrail is trapped.\n\nWe also take the odd list: a mailbox, a gate latch, a doorbell, a closet rod, or a caulk line that has failed. If the job turns into plumbing behind the wall, a new circuit, or a roof, we stop and say so in the room.\n\nSend the rooms, the piece counts, and a photo of anything that is already broken. We quote the visit before anyone drives out, and the price we agree is the price when the list matches the house.",
    media: "/works/handyman-tools.jpg",
    kind: "image",
    alt: "Handyman tools ready for a home repair",
  },
  {
    id: "landscaping",
    title: "Landscaping",
    text: "Yard cleanup, planting, irrigation checks, and outdoor refresh work quoted before we arrive. Tell us the beds, the lawn edges, and the plants you want moved or replaced. We bring the tools for a single visit or a short punch list and leave the yard ready for the weekend.\n\nTypical landscaping deals cover seasonal cleanup, mulch and plant installs, hedge trimming, irrigation head adjustments, and the outdoor details that make the front of the house look finished. If the job needs heavy equipment, a new hardscape, or tree work beyond a trim, we say so on the call and connect you to the right scope instead of guessing.\n\nSend photos of the yard, the beds, and anything that is already failing. We quote the visit before a crew drives out, and the price we agree is the price when the list matches the property.",
    media: "/works/interior-styled.jpg",
    kind: "image",
    alt: "Landscaping and outdoor refresh work",
  },
];

function pageOf(document: CmsDocument) {
  return (document.copy as { dealsPage?: DealsPageCopy }).dealsPage;
}

function normalize(item: Partial<DealItem> | undefined, index: number): DealItem {
  const fallback = defaultDeals[index];
  const kind = item?.kind === "video" ? "video" : "image";
  return {
    id: item?.id?.trim() || fallback?.id || `deal-${index + 1}`,
    title: item?.title?.trim() || fallback?.title || "New deal",
    text: item?.text?.trim() || fallback?.text || "Describe this deal.",
    media: item?.media?.trim() || fallback?.media || "/works/hero.jpg",
    kind,
    alt: item?.alt?.trim() || fallback?.alt || item?.title?.trim() || "Deal",
  };
}

export function ensureDealsPage(document: CmsDocument): CmsDocument {
  const page = pageOf(document);
  if (page && Array.isArray(page.items)) {
    const next = structuredClone(document);
    const current = pageOf(next);
    if (!current) return document;
    if (!current.title?.trim()) current.title = "Deals";
    current.items = current.items.map((item, index) => normalize(item, index));
    const ids = new Set(current.items.map((item) => item.id));
    for (const deal of defaultDeals) {
      if (!ids.has(deal.id)) current.items.push({ ...deal });
    }
    const before = pageOf(document);
    const beforeIds = before?.items?.map((item) => item.id).join("|") ?? "";
    const afterIds = current.items.map((item) => item.id).join("|");
    const unchanged =
      Boolean(before?.title?.trim()) &&
      beforeIds === afterIds &&
      before?.items?.every((item) => item?.id && item.title?.trim() && item.media?.trim() && item.text?.trim());
    return unchanged ? document : next;
  }
  const next = structuredClone(document);
  (next.copy as unknown as { dealsPage: DealsPageCopy }).dealsPage = {
    title: "Deals",
    items: defaultDeals.map((item) => ({ ...item })),
  };
  return next;
}

export function dealsPage(document: CmsDocument): DealsPageCopy {
  const page = pageOf(document);
  if (!page?.items?.length) {
    return { title: page?.title?.trim() || "Deals", items: defaultDeals.map((item) => ({ ...item })) };
  }
  return {
    title: page.title?.trim() || "Deals",
    items: page.items.map((item, index) => normalize(item, index)),
  };
}
