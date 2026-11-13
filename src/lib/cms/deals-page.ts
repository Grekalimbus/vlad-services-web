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


function pageOf(document: CmsDocument) {
  return (document.copy as { dealsPage?: DealsPageCopy }).dealsPage;
}


export function ensureDealsPage(document: CmsDocument): CmsDocument {
  return document;
}

export function dealsPage(document: CmsDocument): DealsPageCopy {
  const page = pageOf(document);
  return {
    title: page?.title ?? "",
    items: (page?.items ?? []).map((item) => ({
      id: item?.id ?? "",
      title: item?.title ?? "",
      text: item?.text ?? "",
      media: item?.media ?? "",
      kind: item?.kind === "video" ? "video" : "image",
      alt: item?.alt ?? "",
    })),
  };
}
