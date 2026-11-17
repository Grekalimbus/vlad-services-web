import { updateDraft } from "@/lib/cms/edit-store";
import { emptyWorksVideo, type WorksVideo } from "@/lib/cms/works-videos";
import { emptyWorksCard } from "@/lib/project-cards";

type WorksWithVideos = {
  copy: {
    home: {
      works: {
        cards: unknown[];
        videos?: WorksVideo[];
      };
    };
  };
};

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

/** Append one empty Projects video slot for the admin editor. */
export function addWorksVideo() {
  updateDraft((document) => {
    const works = (document as WorksWithVideos).copy.home.works;
    if (!Array.isArray(works.videos)) works.videos = [];
    works.videos.push(emptyWorksVideo(works.videos.length));
  });
}

export function removeWorksVideo(index: number) {
  updateDraft((document) => {
    const videos = (document as WorksWithVideos).copy.home.works.videos;
    if (!videos || index < 0 || index >= videos.length) return;
    videos.splice(index, 1);
  });
}
