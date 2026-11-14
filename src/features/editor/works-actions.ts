import { updateDraft } from "@/lib/cms/edit-store";
import { emptyWorksCard } from "@/lib/project-cards";

/**
 * Add Projects carousel card(s) in the admin editor.
 * From the legacy 6-card (2×3) layout, inserts one empty card per row so the
 * 4-column grid stays two even rows without reshuffling existing cards.
 * Otherwise appends a single empty card.
 */
export function addWorksCard() {
  updateDraft((document) => {
    const cards = document.copy.home.works.cards;
    if (cards.length === 6) {
      cards.splice(3, 0, emptyWorksCard());
      cards.push(emptyWorksCard());
      return;
    }
    cards.push(emptyWorksCard());
  });
}
