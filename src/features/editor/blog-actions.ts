import { updateDraft } from "@/lib/cms/edit-store";
import type { BlogItem, BlogPageCopy } from "@/lib/cms/blog-page";

function pageOf(document: { copy: object }) {
  return (document.copy as { blogPage?: BlogPageCopy }).blogPage;
}

function emptyPost(): BlogItem {
  return {
    id: `blog-${crypto.randomUUID().slice(0, 8)}`,
    title: "—",
    text: "—",
    media: "",
    kind: "image",
    alt: "",
  };
}

export function addBlogPost() {
  updateDraft((document) => {
    const copy = document.copy as { blogPage?: BlogPageCopy };
    if (!copy.blogPage) copy.blogPage = { title: "Blog", items: [] };
    copy.blogPage.items.push(emptyPost());
  });
}

export function removeBlogPost(index: number) {
  updateDraft((document) => {
    const items = pageOf(document)?.items;
    if (!items || index < 0 || index >= items.length) return;
    items.splice(index, 1);
  });
}
