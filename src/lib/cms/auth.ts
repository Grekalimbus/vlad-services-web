import type { CmsEnv } from "./types";
import { clientIp, rateLimit, sameOrigin } from "../form-guard";

const COOKIE = "cms_session";
const WEEK = 60 * 60 * 24 * 7;

export async function isAuthorized(request: Request, env: CmsEnv) {
  if (await hasAccess(request, env)) return true;
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
  return json(
    { ok: true },
    200,
    `${COOKIE}=${token}; HttpOnly; Path=/; Max-Age=${WEEK}; SameSite=Lax${secure ? "; Secure" : ""}`,
  );
}

export function logout() {
  return json({ ok: true }, 200, `${COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`);
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

async function hasAccess(request: Request, env: CmsEnv) {
  const team = env.CF_ACCESS_TEAM_DOMAIN;
  const audience = env.CF_ACCESS_AUD;
  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!team || !audience || !token) return false;
  try {
    const [headerText, payloadText, signatureText] = token.split(".");
    if (!headerText || !payloadText || !signatureText) return false;
    const header = JSON.parse(decode(headerText)) as { alg?: string; kid?: string };
    const payload = JSON.parse(decode(payloadText)) as { aud?: string | string[]; exp?: number; iss?: string };
    if (header.alg !== "RS256" || !header.kid) return false;
    const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!audiences.includes(audience)) return false;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return false;
    if (payload.iss !== `https://${team}.cloudflareaccess.com`) return false;
    const certs = await accessCerts(team);
    const jwk = certs.keys.find((key) => key.kid === header.kid);
    if (!jwk) return false;
    const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    const data = new TextEncoder().encode(`${headerText}.${payloadText}`);
    return crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, base64urlDecode(signatureText), data);
  } catch {
    return false;
  }
}

type AccessKey = JsonWebKey & { kid?: string };

const certCache = new Map<string, { exp: number; keys: AccessKey[] }>();

async function accessCerts(team: string) {
  const cached = certCache.get(team);
  if (cached && cached.exp > Date.now()) return cached;
  const response = await fetch(`https://${team}.cloudflareaccess.com/cdn-cgi/access/certs`);
  if (!response.ok) throw new Error("Access certs unavailable");
  const body = (await response.json()) as { keys?: AccessKey[]; public_certs?: { kid: string; cert: string }[] };
  const keys = body.keys ?? [];
  const entry = { exp: Date.now() + 60 * 60 * 1000, keys };
  certCache.set(team, entry);
  return entry;
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

function base64urlDecode(value: string) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/") + "===".slice((value.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

function decode(value: string) {
  return new TextDecoder().decode(base64urlDecode(value));
}

function json(body: unknown, status: number, cookie?: string) {
  const headers = new Headers({ "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  headers.set("x-content-type-options", "nosniff");
  if (cookie) headers.set("set-cookie", cookie);
  return new Response(JSON.stringify(body), { status, headers });
}
