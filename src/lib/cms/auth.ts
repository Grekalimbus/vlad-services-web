import type { CmsEnv } from "./types";
import { clientIp, rateLimit, sameOrigin } from "../form-guard";

const COOKIE = "cms_auth";
const LEGACY_COOKIE = "cms_session";
const WEEK = 60 * 60 * 24 * 7;

export async function isAuthorized(request: Request, env: CmsEnv) {
  return hasSession(request, env);
}

export async function login(request: Request, env: CmsEnv) {
  const password = env.ADMIN_PASSWORD;
  const secret = env.ADMIN_SESSION_SECRET;
  if (!password || !secret) return json({ error: "Admin login is not configured." }, 503);
  if (!sameOrigin(request)) return json({ error: "Request was rejected." }, 403);
  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  const given = body?.password ?? "";
  if (!(await safeEqual(given, password))) {
    if (!rateLimit(`login:${clientIp(request)}`, 8, 15 * 60 * 1000)) {
      return json({ error: "Too many attempts. Try again later." }, 429);
    }
    return json({ error: "Wrong password." }, 401);
  }
  const exp = Math.floor(Date.now() / 1000) + WEEK;
  const token = await signSession(secret, exp);
  const secure = new URL(request.url).protocol === "https:";
  return json({ ok: true }, 200, [sessionCookie(token, secure), ...clearLegacyCookies(secure)]);
}

export function logout(request?: Request) {
  const secure = request ? new URL(request.url).protocol === "https:" : false;
  return json({ ok: true }, 200, [clearCookie(COOKIE, secure), ...clearLegacyCookies(secure)]);
}

async function hasSession(request: Request, env: CmsEnv) {
  const secret = env.ADMIN_SESSION_SECRET;
  if (!secret) return false;
  const cookie = readCookie(request, COOKIE);
  if (!cookie) return false;
  const [expText, signature] = cookie.split(".");
  const exp = Number(expText);
  if (!exp || exp < Math.floor(Date.now() / 1000) || !signature) return false;
  const expected = await sign(`${exp}`, secret);
  return safeEqual(signature, expected);
}

async function signSession(secret: string, exp: number) {
  const signature = await sign(String(exp), secret);
  return `${exp}.${signature}`;
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
  const a = new TextEncoder().encode(left);
  const b = new TextEncoder().encode(right);
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) mismatch |= a[index] ^ b[index];
  return mismatch === 0;
}

function base64url(bytes: Uint8Array) {
  let text = "";
  for (const byte of bytes) text += String.fromCharCode(byte);
  return btoa(text).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function json(body: unknown, status: number, cookie?: string | string[]) {
  const headers = new Headers({
    "content-type": "application/json; charset=utf-8",
    "cache-control": "private, no-store",
    "cdn-cache-control": "no-store",
    vary: "cookie",
  });
  headers.set("x-content-type-options", "nosniff");
  const cookies = cookie == null ? [] : Array.isArray(cookie) ? cookie : [cookie];
  for (const value of cookies) headers.append("set-cookie", value);
  return new Response(JSON.stringify(body), { status, headers });
}
