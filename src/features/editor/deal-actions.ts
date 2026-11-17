import { emptyDealOfferCard, type DealItem, type DealOfferCard } from "@/lib/cms/deals-page";
import { updateDraft } from "@/lib/cms/edit-store";

function itemsOf(document: { copy: object }) {
  return (document.copy as { dealsPage?: { items?: DealItem[] } }).dealsPage?.items;
}

function offerCardsOf(document: { copy: object }, dealIndex: number) {
  const items = itemsOf(document);
  if (!items || dealIndex < 0 || dealIndex >= items.length) return null;
  if (!Array.isArray(items[dealIndex].offerCards)) items[dealIndex].offerCards = [];
  return items[dealIndex].offerCards;
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
      offerCards: [],
      offersFooter: null,
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

export function addDealOfferCard(dealIndex: number) {
  updateDraft((document) => {
    const cards = offerCardsOf(document, dealIndex);
    cards?.push(emptyDealOfferCard());
  });
}

export function removeDealOfferCard(dealIndex: number, offerIndex: number) {
  updateDraft((document) => {
    const cards = offerCardsOf(document, dealIndex);
    if (!cards || offerIndex < 0 || offerIndex >= cards.length) return;
    cards.splice(offerIndex, 1);
  });
}

export function moveDealOfferCard(dealIndex: number, from: number, to: number) {
  updateDraft((document) => {
    const cards = offerCardsOf(document, dealIndex);
    if (!cards || from < 0 || from >= cards.length || to < 0 || to >= cards.length || from === to) return;
    const [card] = cards.splice(from, 1);
    cards.splice(to, 0, card);
  });
}

export function addDealOfferListItem(dealIndex: number, offerIndex: number) {
  updateDraft((document) => {
    const cards = offerCardsOf(document, dealIndex);
    const card = cards?.[offerIndex] as DealOfferCard | undefined;
    if (!card) return;
    if (!Array.isArray(card.listItems)) card.listItems = [];
    card.listItems.push("");
  });
}

export function removeDealOfferListItem(dealIndex: number, offerIndex: number, itemIndex: number) {
  updateDraft((document) => {
    const cards = offerCardsOf(document, dealIndex);
    const card = cards?.[offerIndex] as DealOfferCard | undefined;
    if (!card?.listItems || itemIndex < 0 || itemIndex >= card.listItems.length) return;
    card.listItems.splice(itemIndex, 1);
    if (card.listItems.length === 0) card.listItems.push("");
  });
}
