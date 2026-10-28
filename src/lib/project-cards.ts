import { Cog, Frame, PaintRoller, Refrigerator, TreePine, Tv, Wrench, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CmsDocument } from "./cms/types";

export type ProjectCard = CmsDocument["copy"]["home"]["works"]["cards"][number];

export const projectIcons: Record<string, { label: string; icon: LucideIcon }> = {
  tv: { label: "TV", icon: Tv },
  paint: { label: "Paint", icon: PaintRoller },
  zap: { label: "Electrical", icon: Zap },
  wrench: { label: "Tools", icon: Wrench },
  frame: { label: "Frame", icon: Frame },
  cog: { label: "Repair", icon: Cog },
  refrigerator: { label: "Appliance", icon: Refrigerator },
  tree: { label: "Landscape", icon: TreePine },
};

export const projectIconOptions = Object.entries(projectIcons).map(([value, item]) => ({
  value,
  label: item.label,
}));

const STOCK: Record<string, { icon: string; photos: [string, string] }> = {
  "tv-mounting": { icon: "tv", photos: ["/works/hero.jpg", "/works/tv-living-blue.jpg"] },
  electrical: { icon: "zap", photos: ["/works/wiring.jpg", "/works/electrician.jpg"] },
  handyman: { icon: "wrench", photos: ["/works/furniture.jpg", "/works/pexels-sofa.jpg"] },
  painter: { icon: "paint", photos: ["/works/painting-pexels.jpg", "/works/pexels-drywall.jpg"] },
  "appliance-expert": { icon: "refrigerator", photos: ["/works/pexels-kitchen.jpg", "/works/pexels-outlet.jpg"] },
  landscaper: { icon: "tree", photos: ["/works/modern-interior.jpg", "/works/interior-styled.jpg"] },
};

export function projectCardFor(category: { slug: string; name: string }, cover = ""): ProjectCard {
  const stock = STOCK[category.slug] ?? { icon: "wrench", photos: ["/works/hero.jpg", "/works/modern-interior.jpg"] as [string, string] };
  const title = category.name.trim() || "Service";
  const first = cover || stock.photos[0];
  const second = stock.photos.find((photo) => photo !== first) ?? stock.photos[1];
  const photos = [first, second].map((image) => ({ image, alt: title, position: "center" }));
  return {
    title,
    lines: [],
    href: `/services/${category.slug}`,
    src: photos[0]?.image ?? "",
    alt: title,
    position: "center",
    icon: stock.icon,
    photos,
  };
}
