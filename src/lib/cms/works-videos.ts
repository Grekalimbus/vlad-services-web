import type { CmsDocument } from "./types";

export type WorksVideo = {
	id: string;
	media: string;
	poster: string;
	alt: string;
};

type WorksVideosField = {
	videos?: WorksVideo[];
};

function worksOf(document: CmsDocument) {
	return document.copy.home.works as typeof document.copy.home.works & WorksVideosField;
}

/** Empty Projects video slot — editable in admin, neutral placeholder publicly. */
export function emptyWorksVideo(index = 0): WorksVideo {
	return {
		id: `works-video-${index + 1}`,
		media: "",
		poster: "",
		alt: "",
	};
}

export function worksVideos(document: CmsDocument): WorksVideo[] {
	const saved = worksOf(document).videos;
	if (!Array.isArray(saved)) return [];
	return saved.map((item, index) => ({
		id: item?.id?.trim() || `works-video-${index + 1}`,
		media: item?.media?.trim() || "",
		poster: item?.poster?.trim() || "",
		alt: item?.alt?.trim() || "",
	}));
}
