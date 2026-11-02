import { updateDraft } from "@/lib/cms/edit-store";
import type { DealItem } from "@/lib/cms/deals-page";

function itemsOf(document: { copy: object }) {
  return (document.copy as { dealsPage?: { items?: DealItem[] } }).dealsPage?.items;
}

export function addDeal() {
  updateDraft((document) => {
    const items = itemsOf(document);
    if (!items) return;
    items.push({
      id: `deal-${crypto.randomUUID().slice(0, 8)}`,
      title: "New deal",
      text: "Describe this deal.",
      media: "/works/hero.jpg",
      kind: "image",
      alt: "New deal",
    });
  });
}

export function removeDeal(index: number) {
  updateDraft((document) => {
    const items = itemsOf(document);
    if (!items || index < 0 || index >= items.length) return;
    items.splice(index, 1);
  });
}
