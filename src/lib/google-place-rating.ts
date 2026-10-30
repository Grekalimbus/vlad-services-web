type LiveRating = {
  rating: number;
  reviewCount: number;
};

const SUCCESS_TTL_MS = 60 * 60 * 1000;
const FAILURE_TTL_MS = 5 * 60 * 1000;

let cache: { at: number; key: string; value: LiveRating | null; ttl: number } | null = null;

export async function readLiveGoogleRating(mapsUrl: string | undefined): Promise<LiveRating | null> {
  if (!mapsUrl) return null;
  if (cache && cache.key === mapsUrl && Date.now() - cache.at < cache.ttl) return cache.value;
  const value = await fetchLiveRating(mapsUrl);
  cache = { at: Date.now(), key: mapsUrl, value, ttl: value ? SUCCESS_TTL_MS : FAILURE_TTL_MS };
  return value;
}

async function fetchLiveRating(mapsUrl: string): Promise<LiveRating | null> {
  try {
    const place = await fetch(mapsUrl, {
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
      headers: { "user-agent": "Mozilla/5.0", "accept-language": "en-US,en;q=0.9" },
    });
    if (!place.ok) return null;
    const previewHref = (await place.text()).match(/href="(\/maps\/preview\/place\?[^"]+)"/)?.[1];
    if (!previewHref) return null;
    const preview = await fetch(`https://www.google.com${previewHref.replaceAll("&amp;", "&")}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
      headers: { "user-agent": "Mozilla/5.0", "accept-language": "en-US,en;q=0.9" },
    });
    if (!preview.ok) return null;
    const match = (await preview.text()).match(/null,null,null,(\d+(?:\.\d+)?),(\d+)\]/);
    if (!match) return null;
    const rating = Number(match[1]);
    const reviewCount = Number(match[2]);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) return null;
    if (!Number.isInteger(reviewCount) || reviewCount < 0) return null;
    return { rating, reviewCount };
  } catch {
    return null;
  }
}
