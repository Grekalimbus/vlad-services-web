import type { CmsDocument } from "./types";

export type TrustPromoCopy = {
  lead: string;
  accent: string;
  tail: string;
  text: string;
  button: string;
};

export function trustPromo(document: CmsDocument): TrustPromoCopy {
  const home = document.copy.home as typeof document.copy.home & {
    trustPromo?: Partial<TrustPromoCopy>;
  };
  const promo = home.trustPromo ?? {};
  return {
    lead: promo.lead ?? "",
    accent: promo.accent ?? "",
    tail: promo.tail ?? "",
    text: promo.text ?? "",
    button: promo.button ?? "",
  };
}
