import {
  BadgeCheck,
  Bot,
  Building2,
  CircleHelp,
  Home,
  KeyRound,
  ShoppingBag,
  Users,
} from "lucide-react";
import { hearAboutIcons, hearAboutOptions, type HearAboutOption } from "@/lib/hear-about";
import {
  FacebookIcon,
  GoogleIcon,
  InstagramIcon,
  LinkedInIcon,
  YelpIcon,
} from "@/shared/brand-icons";

export function HearAboutIcon({ value, className }: { value: string; className?: string }) {
  const option = (hearAboutOptions as readonly string[]).includes(value)
    ? (value as HearAboutOption)
    : null;
  const id = option ? hearAboutIcons[option] : null;

  switch (id) {
    case "friend":
      return <Users size={14} aria-hidden="true" className={className} />;
    case "google":
      return <GoogleIcon className={className} />;
    case "instagram":
      return <InstagramIcon className={className} />;
    case "facebook":
      return <FacebookIcon className={className} />;
    case "linkedin":
      return <LinkedInIcon className={className} />;
    case "yelp":
      return <YelpIcon className={className} />;
    case "bbb":
      return <BadgeCheck size={14} aria-hidden="true" className={className} />;
    case "home":
      return <Home size={14} aria-hidden="true" className={className} />;
    case "agent":
      return <KeyRound size={14} aria-hidden="true" className={className} />;
    case "offerup":
      return <ShoppingBag size={14} aria-hidden="true" className={className} />;
    case "ai":
      return <Bot size={14} aria-hidden="true" className={className} />;
    case "other":
      return <CircleHelp size={14} aria-hidden="true" className={className} />;
    default:
      return <Building2 size={14} aria-hidden="true" className={className} />;
  }
}
