import type { CmsDocument } from "./types";

export type BlogItem = {
  id: string;
  title: string;
  text: string;
  media: string;
  kind: "image" | "video";
  alt: string;
};

export type BlogPageCopy = {
  title: string;
  items: BlogItem[];
};

function pageOf(document: CmsDocument) {
  return (document.copy as { blogPage?: BlogPageCopy }).blogPage;
}

export function ensureBlogPage(document: CmsDocument): CmsDocument {
  return document;
}

export function blogPage(document: CmsDocument): BlogPageCopy {
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
