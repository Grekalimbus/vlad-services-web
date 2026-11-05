const hits = new Map<string, { count: number; reset: number }>();

const HONEYPOT_KEYS = ["company_url", "website", "fax_number"] as const;

/** Soft limits: enough for real clients (retries, several forms), tight enough against spam. */
export const APPLICATION_RATE = { limit: 15, windowMs: 10 * 60 * 1000 } as const;
export const LOGIN_RATE = { limit: 8, windowMs: 15 * 60 * 1000 } as const;

type RateLimitDb = {
  prepare: (sql: string) => {
    bind: (...values: unknown[]) => {
      first: <T>() => Promise<T | null>;
      run: () => Promise<{ meta?: { changes?: number } } | unknown>;
    };
  };
};

export function clientIp(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "local"
  );
}

/** Reject cross-site and Origin-less scripted requests; allow normal same-site browser posts. */
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const site = request.headers.get("sec-fetch-site");
  if (site === "cross-site") return false;
  if (origin === "null") return false;
  if (origin) {
    try {
      return new URL(origin).host === new URL(request.url).host;
    } catch {
      return false;
    }
  }
  if (site === "same-origin" || site === "same-site" || site === "none") return true;
  return false;
}

/**
 * Soft IP rate limit. Prefers D1 so limits survive across Cloudflare isolates;
 * falls back to in-memory when DB is unavailable (local/dev).
 */
export async function rateLimit(
  env: { CMS_DB?: RateLimitDb } | undefined,
  key: string,
  limit: number,
  windowMs: number,
) {
  if (env?.CMS_DB) {
    try {
      return await durableRateLimit(env.CMS_DB, key, limit, windowMs);
    } catch {
      // Fall through to memory if the table/query fails.
    }
  }
  return memoryRateLimit(key, limit, windowMs);
}

export function honeypotTripped(source: FormData | Record<string, unknown>) {
  for (const key of HONEYPOT_KEYS) {
    const value = source instanceof FormData ? source.get(key) : source[key];
    if (typeof value === "string" && value.trim()) return true;
    if (value instanceof File && value.size > 0) return true;
  }
  return false;
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

function memoryRateLimit(key: string, limit: number, windowMs: number) {
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
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

async function durableRateLimit(db: RateLimitDb, key: string, limit: number, windowMs: number) {
  await db
    .prepare(
      "CREATE TABLE IF NOT EXISTS rate_limits (id TEXT PRIMARY KEY, count INTEGER NOT NULL, reset_at INTEGER NOT NULL)",
    )
    .bind()
    .run();

  const now = Date.now();

  // Atomic-ish increment while under the limit and inside the window.
  const bumped = await db
    .prepare(
      "UPDATE rate_limits SET count = count + 1 WHERE id = ? AND reset_at > ? AND count < ?",
    )
    .bind(key, now, limit)
    .run();
  if (changes(bumped) > 0) return true;

  const row = await db
    .prepare("SELECT count AS count, reset_at AS reset_at FROM rate_limits WHERE id = ?")
    .bind(key)
    .first<{ count: number; reset_at: number }>();

  if (row && Number(row.reset_at) > now && Number(row.count) >= limit) return false;

  await db
    .prepare("INSERT OR REPLACE INTO rate_limits (id, count, reset_at) VALUES (?, 1, ?)")
    .bind(key, now + windowMs)
    .run();
  return true;
}

function changes(result: unknown) {
  if (!result || typeof result !== "object") return 0;
  const meta = (result as { meta?: { changes?: number } }).meta;
  return typeof meta?.changes === "number" ? meta.changes : 0;
}
