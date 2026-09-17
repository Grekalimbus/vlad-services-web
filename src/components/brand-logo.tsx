import Image from "next/image";
import { assetPath, site } from "@/lib/site";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
  size?: "header" | "footer";
};

export function BrandLogo({
  className = "",
  priority = false,
  size = "header",
}: BrandLogoProps) {
  const dimensions =
    size === "footer"
      ? "h-[4.5rem] w-[15.5rem] md:h-20 md:w-[18rem]"
      : "h-11 w-[12.5rem]";

  return (
    <span
      className={`relative block overflow-hidden rounded-full bg-white ${dimensions} ${className}`}
    >
      <Image
        src={assetPath(site.logo)}
        alt={site.shortName}
        fill
        priority={priority}
        sizes={size === "footer" ? "288px" : "200px"}
        className="object-cover object-center"
      />
    </span>
  );
}
