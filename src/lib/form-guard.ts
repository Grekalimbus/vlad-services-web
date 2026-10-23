const hits = new Map<string, { count: number; reset: number }>();

export function clientIp(request: Request) {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const site = request.headers.get("sec-fetch-site");
  if (site === "cross-site") return false;
  if (!origin) return true;
  if (origin === "null") return false;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (hits.size > 5000) {
    for (const [entry, value] of hits) {
      if (value.reset < now) hits.delete(entry);
    }
  }
  const current = hits.get(key);
  if (!current || current.reset < now) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  current.count += 1;
  return current.count <= limit;
}

export function plainText(value: unknown, max: number) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function applySecurityHeaders(headers: Headers) {
  headers.set("x-content-type-options", "nosniff");
  headers.set("referrer-policy", "strict-origin-when-cross-origin");
  headers.set("x-frame-options", "SAMEORIGIN");
  headers.set("permissions-policy", "camera=(), microphone=(), geolocation=()");
  if (!headers.has("content-security-policy")) headers.set("content-security-policy", "frame-ancestors 'self'");
}
