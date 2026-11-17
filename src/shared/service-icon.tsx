import {
  Flower2,
  Layers,
  TreePine,
  Tv,
  UserPlus,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

function matchServiceIcon(service: string): LucideIcon {
  const value = service.trim().toLowerCase();
  if (!value) return Layers;
  if (value.includes("sign up") || value === "signup") return UserPlus;
  if (value.includes("tv") || value.includes("mount")) return Tv;
  if (value.includes("electric") || value.includes("zap")) return Zap;
  if (value.includes("handyman") || value.includes("handy")) return Wrench;
  if (value.includes("landscap") || value.includes("garden") || value.includes("tree")) return TreePine;
  if (value.includes("season") || value.includes("decor") || value.includes("flower")) return Flower2;
  return Layers;
}

export function ServiceIcon({
  service,
  size = 14,
  className,
}: {
  service: string;
  size?: number;
  className?: string;
}) {
  const Icon = matchServiceIcon(service);
  return <Icon size={size} aria-hidden="true" className={className} />;
}
