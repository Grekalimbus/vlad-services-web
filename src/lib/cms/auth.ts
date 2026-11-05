import type { CmsEnv } from "./types";
import { clientIp, LOGIN_RATE, rateLimit, sameOrigin } from "../form-guard";

const COOKIE = "cms_auth";
const LEGACY_COOKIE = "cms_session";
const WEEK = 60 * 60 * 24 * 7;
const MIN_PASSWORD_LENGTH = 12;
const MIN_SECRET_LENGTH = 32;
const WEAK_PASSWORDS = new Set([
  "password",
  "password123",
  "password1234",
  "admin",
  "admin123",
  "admin1234",
  "123456789012",
  "qwertyuiopas",
  "changeme1234",
  "primefix",
  "primefix123",
]);

export async function isAuthorized(request: Request, env: CmsEnv) {
  return hasSession(request, env);
}

export async function login(request: Request, env: CmsEnv) {
  const configured = adminSecrets(env);
  if (!configured.ok) return json({ error: configured.error }, 503);
  if (!sameOrigin(request)) return json({ error: "Request was rejected." }, 403);
  if (!(await rateLimit(env, `login:${clientIp(request)}`, LOGIN_RATE.limit, LOGIN_RATE.windowMs))) {
    return json({ error: "Too many attempts. Try again later." }, 429, undefined, LOGIN_RATE.windowMs);
  }
  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  const given = typeof body?.password === "string" ? body.password.slice(0, 256) : "";
  if (!(await safeEqual(given, configured.password))) {
    return json({ error: "Wrong password." }, 401);
  }
  const exp = Math.floor(Date.now() / 1000) + WEEK;
  const token = await signSession(configured.secret, configured.password, exp);
  const secure = new URL(request.url).protocol === "https:";
  return json({ ok: true }, 200, [sessionCookie(token, secure), ...clearLegacyCookies(secure)]);
}

export function logout(request?: Request) {
  const secure = request ? new URL(request.url).protocol === "https:" : false;
  return json({ ok: true }, 200, [clearCookie(COOKIE, secure), ...clearLegacyCookies(secure)]);
}

async function hasSession(request: Request, env: CmsEnv) {
  const configured = adminSecrets(env);
  if (!configured.ok) return false;
  const cookie = readCookie(request, COOKIE);
  if (!cookie) return false;
  const parts = cookie.split(".");
  // New format: exp.pwdTag.signature — password change changes pwdTag and invalidates sessions.
  if (parts.length !== 3) return false;
  const [expText, pwdTag, signature] = parts;
  const exp = Number(expText);
  if (!exp || exp < Math.floor(Date.now() / 1000) || !pwdTag || !signature) return false;
  const expectedTag = await passwordTag(configured.secret, configured.password);
  if (!(await safeEqual(pwdTag, expectedTag))) return false;
  const expected = await sign(`${exp}.${pwdTag}`, configured.secret);
  return safeEqual(signature, expected);
}

function adminSecrets(env: CmsEnv):
  | { ok: true; password: string; secret: string }
  | { ok: false; error: string } {
  const password = env.ADMIN_PASSWORD ?? "";
  const secret = env.ADMIN_SESSION_SECRET ?? "";
  if (!password || !secret) {
    return { ok: false, error: "Admin login is not configured." };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      ok: false,
      error: `ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }
  if (WEAK_PASSWORDS.has(password.toLowerCase())) {
    return { ok: false, error: "ADMIN_PASSWORD is too common. Choose a stronger password." };
  }
  if (secret.length < MIN_SECRET_LENGTH) {
    return {
      ok: false,
      error: `ADMIN_SESSION_SECRET must be at least ${MIN_SECRET_LENGTH} characters.`,
    };
  }
  if (secret === password) {
    return { ok: false, error: "ADMIN_SESSION_SECRET must differ from ADMIN_PASSWORD." };
  }
  return { ok: true, password, secret };
}

async function signSession(secret: string, password: string, exp: number) {
  const tag = await passwordTag(secret, password);
  const signature = await sign(`${exp}.${tag}`, secret);
  return `${exp}.${tag}.${signature}`;
}

/** Stable short tag derived from the current password; changes when the password changes. */
async function passwordTag(secret: string, password: string) {
  return (await sign(`pwd:${password}`, secret)).slice(0, 16);
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const bytes = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
  return base64url(bytes);
}

function sessionCookie(token: string, secure: boolean) {
  return `${COOKIE}=${token}; HttpOnly; Path=/; Max-Age=${WEEK}; SameSite=Strict${secure ? "; Secure" : ""}`;
}

function clearLegacyCookies(secure: boolean) {
  return [clearCookie(LEGACY_COOKIE, secure, "Lax"), clearCookie(LEGACY_COOKIE, secure, "Strict")];
}

function clearCookie(name: string, secure: boolean, sameSite: "Strict" | "Lax" = "Strict") {
  return `${name}=; HttpOnly; Path=/; Max-Age=0; SameSite=${sameSite}${secure ? "; Secure" : ""}`;
}

function readCookie(request: Request, name: string) {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return "";
}

async function safeEqual(left: string, right: string) {
  const encoder = new TextEncoder();
  const a = encoder.encode(left);
  const b = encoder.encode(right);
  const length = Math.max(a.length, b.length);
  let mismatch = a.length === b.length ? 0 : 1;
  for (let index = 0; index < length; index += 1) {
    mismatch |= (a[index] ?? 0) ^ (b[index] ?? 0);
  }
  return mismatch === 0;
}

function base64url(bytes: Uint8Array) {
  let text = "";
  for (const byte of bytes) text += String.fromCharCode(byte);
  return btoa(text).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function json(body: unknown, status: number, cookie?: string | string[], retryAfterMs?: number) {
  const headers = new Headers({
    "content-type": "application/json; charset=utf-8",
    "cache-control": "private, no-store",
    "cdn-cache-control": "no-store",
    vary: "cookie",
  });
  headers.set("x-content-type-options", "nosniff");
  headers.set("referrer-policy", "strict-origin-when-cross-origin");
  headers.set("x-frame-options", "SAMEORIGIN");
  headers.set("permissions-policy", "camera=(), microphone=(), geolocation=()");
  headers.set("content-security-policy", "frame-ancestors 'self'");
  if (status === 429 && retryAfterMs) {
    headers.set("retry-after", String(Math.ceil(retryAfterMs / 1000)));
  }
  const cookies = cookie == null ? [] : Array.isArray(cookie) ? cookie : [cookie];
  for (const value of cookies) headers.append("set-cookie", value);
  return new Response(JSON.stringify(body), { status, headers });
}
