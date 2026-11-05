import { Sora, Space_Grotesk } from "next/font/google";

/** Plan UI fonts — loaded only on pages that render the TV plan section. */
export const planSora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  preload: false,
});

export const planSpaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  preload: false,
});

export const planFontVariables = `${planSora.variable} ${planSpaceGrotesk.variable}`;
