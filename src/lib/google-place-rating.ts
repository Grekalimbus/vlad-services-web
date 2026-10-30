type LiveRating = {
  rating: number;
  reviewCount: number;
};

type ListingDocument = {
  googleListing?: {
    mapsUrl?: string;
    rating?: number;
    reviewCount?: number;
  };
};

const SUCCESS_TTL_MS = 60 * 60 * 1000;
const FAILURE_TTL_MS = 5 * 60 * 1000;

let cache: { at: number; key: string; value: LiveRating | null; ttl: number } | null = null;

export async function applyLiveGoogleRating<T extends ListingDocument>(document: T): Promise<T> {
  const listing = document.googleListing;
  if (!listing?.mapsUrl) return document;
  const live = await readLiveGoogleRating(listing.mapsUrl);
  if (!live) return document;
  if (listing.rating === live.rating && listing.reviewCount === live.reviewCount) return document;
  const next = structuredClone(document);
  next.googleListing = { ...listing, rating: live.rating, reviewCount: live.reviewCount };
  return next;
}

export async function readLiveGoogleRating(mapsUrl: string | undefined): Promise<LiveRating | null> {
  if (!mapsUrl) return null;
  if (cache && cache.key === mapsUrl && Date.now() - cache.at < cache.ttl) return cache.value;
  const stored = await readEdgeCache(mapsUrl);
  if (stored?.value) {
    cache = { at: Date.now(), key: mapsUrl, value: stored.value, ttl: stored.ttl };
    return stored.value;
  }
  const value = await fetchLiveRating(mapsUrl);
  const ttl = value ? SUCCESS_TTL_MS : FAILURE_TTL_MS;
  cache = { at: Date.now(), key: mapsUrl, value, ttl };
  await writeEdgeCache(mapsUrl, value, ttl);
  return value;
}

function edgeCache() {
  if (typeof navigator === "undefined" || !navigator.userAgent.includes("Cloudflare")) return null;
  const storage = caches as CacheStorage & { default?: Cache };
  return storage.default ?? null;
}

function cacheRequest(mapsUrl: string) {
  return new Request(`https://primefixpros.com/__google-rating?url=${encodeURIComponent(mapsUrl)}`);
}

async function readEdgeCache(mapsUrl: string): Promise<{ value: LiveRating | null; ttl: number } | undefined> {
  const edge = edgeCache();
  if (!edge) return undefined;
  try {
    const response = await edge.match(cacheRequest(mapsUrl));
    if (!response) return undefined;
    const body = (await response.json()) as { value?: LiveRating | null; ttl?: number };
    return { value: body.value ?? null, ttl: body.ttl ?? SUCCESS_TTL_MS };
  } catch {
    return undefined;
  }
}

async function writeEdgeCache(mapsUrl: string, value: LiveRating | null, ttl: number) {
  const edge = edgeCache();
  if (!edge) return;
  try {
    await edge.put(
      cacheRequest(mapsUrl),
      new Response(JSON.stringify({ value, ttl }), {
        headers: { "cache-control": `public, max-age=${Math.ceil(ttl / 1000)}` },
      }),
    );
  } catch {
    void 0;
  }
}

const REQUEST_HEADERS = { "user-agent": "Mozilla/5.0", "accept-language": "en-US,en;q=0.9" };

async function fetchLiveRating(mapsUrl: string): Promise<LiveRating | null> {
  try {
    const place = await fetch(mapsUrl, {
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
      headers: REQUEST_HEADERS,
    });
    const placeUrl = place.url;
    const html = await place.text();
    if (place.ok) {
      const previewHref = html.match(/href="(\/maps\/preview\/place\?[^"]+)"/)?.[1];
      if (previewHref) {
        const preview = await ratingFromPreview(`https://www.google.com${previewHref.replaceAll("&amp;", "&")}`);
        if (preview) return preview;
      }
    }
    const cid = cidFrom(placeUrl) ?? cidFrom(html);
    if (!cid) return null;
    return ratingFromEmbed(cid);
  } catch {
    return null;
  }
}

async function ratingFromPreview(url: string): Promise<LiveRating | null> {
  const preview = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
    headers: REQUEST_HEADERS,
  });
  if (!preview.ok) return null;
  const match = (await preview.text()).match(/null,null,null,(\d+(?:\.\d+)?),(\d+)\]/);
  if (!match) return null;
  return validRating(Number(match[1]), Number(match[2]));
}

async function ratingFromEmbed(cid: string): Promise<LiveRating | null> {
  const embed = await fetch(`https://maps.google.com/maps?cid=${cid}&hl=en&output=embed`, {
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
    headers: REQUEST_HEADERS,
  });
  if (!embed.ok) return null;
  const match = (await embed.text()).match(/null,(\d+(?:\.\d+)?),"(\d+) reviews"/);
  if (!match) return null;
  const rounded = Math.round(Number(match[1]) * 10) / 10;
  return validRating(rounded, Number(match[2]));
}

function cidFrom(value: string) {
  let decoded = value;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      break;
    }
  }
  const ftid = decoded.match(/ftid=0x[0-9a-f]+:0x([0-9a-f]+)/i);
  if (ftid?.[1]) return BigInt(`0x${ftid[1]}`).toString();
  const cid = decoded.match(/[?&]cid=(\d+)/);
  return cid?.[1] ?? null;
}

function validRating(rating: number, reviewCount: number): LiveRating | null {
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) return null;
  if (!Number.isInteger(reviewCount) || reviewCount < 0) return null;
  return { rating, reviewCount };
}
