import { isAuthorized } from "./cms/auth";
import { discardImage, loadImage, storeImage } from "./cms/content-store";
import { applySecurityHeaders, clientIp, plainText, rateLimit, sameOrigin } from "./form-guard";
import type { CmsEnv } from "./cms/types";

const MAX_PHOTOS = 5;
const MAX_BYTES = 10 * 1024 * 1024;
const phonePattern = /^[\d+\s()-]{10,20}$/;
const zipPattern = /^\d{5}(?:-\d{4})?$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type StoredPhoto = { key: string; name: string; type: string };

type ApplicationStatus = "new" | "contacted" | "scheduled";

type StoredApplication = {
  id: string;
  submittedAt: string;
  name: string;
  phone: string;
  email: string;
  zip: string;
  service: string;
  status: ApplicationStatus;
  photos: StoredPhoto[];
};

export type ApplicationView = {
  id: string;
  submittedAt: string;
  name: string;
  phone: string;
  email: string;
  zip: string;
  service: string;
  status: ApplicationStatus;
  photos: { index: number; name: string }[];
};

export async function handleApplicationPost(request: Request, env: CmsEnv) {
  try {
    if (!sameOrigin(request)) return json({ error: "Request was rejected." }, 403);
    if (!rateLimit(`application:${clientIp(request)}`, 20, 10 * 60 * 1000)) {
      return json({ error: "Too many requests. Try again later." }, 429);
    }
    const length = Number(request.headers.get("content-length") || 0);
    if (length > 52 * 1024 * 1024) return json({ error: "Upload is too large." }, 413);
    const form = await request.formData();
    if (form.get("privacy") !== "yes" || form.get("messaging") !== "yes") {
      return json({ error: "Agree to the Privacy Policy and Messaging Terms & Conditions." }, 400);
    }
    const name = plainText(form.get("name"), 120);
    const phone = plainText(form.get("phone"), 40);
    const email = plainText(form.get("email"), 200);
    const zip = plainText(form.get("zip"), 20);
    const service = plainText(form.get("service"), 80);
    if (name.length < 2) return json({ error: "Enter your name." }, 400);
    if (!phonePattern.test(phone)) return json({ error: "Enter a phone number." }, 400);
    if (email && !emailPattern.test(email)) return json({ error: "Enter a valid email or leave it blank." }, 400);
    if (zip && !zipPattern.test(zip)) return json({ error: "Enter a 5-digit ZIP code or leave it blank." }, 400);

    const files = form.getAll("photos").filter((value): value is File => value instanceof File && value.size > 0);
    if (files.length > MAX_PHOTOS) return json({ error: "You can upload up to 5 photos." }, 400);
    const photos: { name: string; type: string; bytes: Uint8Array }[] = [];
    for (const file of files) {
      if (file.size > MAX_BYTES) return json({ error: "Upload JPG or PNG photos up to 10 MB each." }, 400);
      const bytes = new Uint8Array(await file.arrayBuffer());
      const type = sniff(bytes);
      if (!type || bytes.byteLength > MAX_BYTES) {
        return json({ error: "Upload JPG or PNG photos up to 10 MB each." }, 400);
      }
      photos.push({ name: plainText(file.name, 180) || "photo", type, bytes });
    }

    await createApplication(env, { name, phone, email, zip, service, photos });
    return json({ ok: true });
  } catch {
    return json({ error: "Could not save the request." }, 500);
  }
}

export async function handleApplicationList(request: Request, env: CmsEnv) {
  if (!(await isAuthorized(request, env))) return json({ error: "Unauthorized" }, 401);
  try {
    const items = (await readApplications(env)).map(toView);
    return json({ items });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Could not load applications." }, 500);
  }
}

export async function handleApplicationPhoto(request: Request, env: CmsEnv, id: string, indexText: string) {
  if (!(await isAuthorized(request, env))) return json({ error: "Unauthorized" }, 401);
  const index = Number(indexText);
  if (!/^[0-9a-f-]{36}$/i.test(id) || !Number.isInteger(index) || index < 0 || index >= MAX_PHOTOS) {
    return new Response("Not found", { status: 404 });
  }
  try {
    const application = (await readApplications(env)).find((item) => item.id === id);
    const photo = application?.photos[index];
    if (!photo || !isPhotoKey(id, photo.key)) return new Response("Not found", { status: 404 });
    const media = await readPhoto(env, photo.key);
    if (!media) return new Response("Not found", { status: 404 });
    return new Response(Uint8Array.from(media.bytes), {
      headers: {
        "content-type": media.type === "image/png" ? "image/png" : "image/jpeg",
        "content-disposition": "inline",
        "cache-control": "private, no-store",
        "x-content-type-options": "nosniff",
        "content-security-policy": "default-src 'none'; sandbox",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

export async function handleApplicationUpdate(request: Request, env: CmsEnv, id: string) {
  if (!sameOrigin(request)) return json({ error: "Request was rejected." }, 403);
  if (!(await isAuthorized(request, env))) return json({ error: "Unauthorized" }, 401);
  if (!isId(id)) return json({ error: "Not found." }, 404);
  const status = await readStatus(request);
  if (!status) return json({ error: "Unknown status." }, 400);
  try {
    const updated = await updateApplication(env, id, status);
    if (!updated) return json({ error: "Not found." }, 404);
    return json({ ok: true, status });
  } catch {
    return json({ error: "Could not update the application." }, 500);
  }
}

export async function handleApplicationDelete(request: Request, env: CmsEnv, id: string) {
  if (!sameOrigin(request)) return json({ error: "Request was rejected." }, 403);
  if (!(await isAuthorized(request, env))) return json({ error: "Unauthorized" }, 401);
  if (!isId(id)) return json({ error: "Not found." }, 404);
  try {
    const removed = await deleteApplication(env, id);
    if (!removed) return json({ error: "Not found." }, 404);
    return json({ ok: true });
  } catch {
    return json({ error: "Could not delete the application." }, 500);
  }
}

async function createApplication(
  env: CmsEnv,
  input: {
    name: string;
    phone: string;
    email: string;
    zip: string;
    service: string;
    photos: { name: string; type: string; bytes: Uint8Array }[];
  },
) {
  const id = crypto.randomUUID();
  const submittedAt = new Date().toISOString();
  const photos: StoredPhoto[] = [];
  for (let index = 0; index < input.photos.length; index += 1) {
    const photo = input.photos[index];
    const extension = photo.type === "image/png" ? "png" : "jpg";
    const key = `applications/${id}/${index}.${extension}`;
    await storeImage(env, key, photo.bytes, photo.type);
    photos.push({ key, name: photo.name, type: photo.type });
  }
  const row: StoredApplication = {
    id,
    submittedAt,
    name: input.name,
    phone: input.phone,
    email: input.email,
    zip: input.zip,
    service: input.service,
    status: "new",
    photos,
  };
  if (env.CMS_DB) {
    await ensureTable(env);
    await env.CMS_DB.prepare(
      "INSERT INTO applications (id, submitted_at, name, phone, email, zip, service, photos, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
      .bind(id, submittedAt, row.name, row.phone, row.email, row.zip, row.service, JSON.stringify(photos), row.status)
      .run();
    return;
  }
  if (!env.readApplications || !env.writeApplications) throw new Error("Application storage is not configured.");
  const current = await readApplications(env);
  await env.writeApplications([row, ...current]);
}

async function readApplications(env: CmsEnv): Promise<StoredApplication[]> {
  if (env.CMS_DB) {
    await ensureTable(env);
    const page = await env.CMS_DB.prepare(
      "SELECT id, submitted_at, name, phone, email, zip, service, photos, status FROM applications ORDER BY submitted_at DESC",
    )
      .bind()
      .all<Row>();
    return (page.results ?? []).map(fromRow);
  }
  const value = (await env.readApplications?.()) ?? [];
  if (!Array.isArray(value)) return [];
  return value.filter(isStored).map(withStatus);
}

async function readPhoto(env: CmsEnv, key: string) {
  const image = await loadImage(env, key);
  if (!image) return null;
  return { bytes: image.bytes, type: image.type === "application/octet-stream" ? typeFor(key) : image.type };
}

async function updateApplication(env: CmsEnv, id: string, status: ApplicationStatus) {
  if (env.CMS_DB) {
    await ensureTable(env);
    const existing = await env.CMS_DB.prepare("SELECT id FROM applications WHERE id = ?").bind(id).first();
    if (!existing) return false;
    await env.CMS_DB.prepare("UPDATE applications SET status = ? WHERE id = ?").bind(status, id).run();
    return true;
  }
  if (!env.readApplications || !env.writeApplications) throw new Error("Application storage is not configured.");
  const current = await readApplications(env);
  if (!current.some((item) => item.id === id)) return false;
  await env.writeApplications(current.map((item) => (item.id === id ? { ...item, status } : item)));
  return true;
}

async function deleteApplication(env: CmsEnv, id: string) {
  const current = await readApplications(env);
  const item = current.find((entry) => entry.id === id);
  if (!item) return false;
  for (const photo of item.photos) {
    if (!isPhotoKey(id, photo.key)) continue;
    try {
      await discardImage(env, photo.key);
    } catch {
      /* The application row is still removed. */
    }
  }
  if (env.CMS_DB) {
    await env.CMS_DB.prepare("DELETE FROM applications WHERE id = ?").bind(id).run();
    return true;
  }
  if (!env.writeApplications) throw new Error("Application storage is not configured.");
  await env.writeApplications(current.filter((entry) => entry.id !== id));
  return true;
}

async function ensureTable(env: CmsEnv) {
  if (!env.CMS_DB) return;
  await env.CMS_DB.prepare(
    "CREATE TABLE IF NOT EXISTS applications (id TEXT PRIMARY KEY, submitted_at TEXT NOT NULL, name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT NOT NULL, zip TEXT NOT NULL, service TEXT NOT NULL, photos TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'new')",
  )
    .bind()
    .run();
  try {
    await env.CMS_DB.prepare("ALTER TABLE applications ADD COLUMN status TEXT NOT NULL DEFAULT 'new'").bind().run();
  } catch {
    /* The column is already present. */
  }
}

function toView(item: StoredApplication): ApplicationView {
  return {
    id: item.id,
    submittedAt: item.submittedAt,
    name: item.name,
    phone: item.phone,
    email: item.email,
    zip: item.zip,
    service: item.service,
    status: item.status,
    photos: item.photos.map((photo, index) => ({ index, name: photo.name })),
  };
}

type Row = {
  id: string;
  submitted_at: string;
  name: string;
  phone: string;
  email: string;
  zip: string;
  service: string;
  photos: string;
  status?: string;
};

function fromRow(row: Row): StoredApplication {
  let photos: StoredPhoto[] = [];
  try {
    const parsed = JSON.parse(row.photos);
    if (Array.isArray(parsed)) photos = parsed.filter(isPhoto);
  } catch {
    photos = [];
  }
  return {
    id: row.id,
    submittedAt: row.submitted_at,
    name: row.name,
    phone: row.phone,
    email: row.email,
    zip: row.zip,
    service: row.service,
    status: asStatus(row.status),
    photos,
  };
}

function withStatus(item: StoredApplication): StoredApplication {
  return { ...item, status: asStatus(item.status) };
}

function asStatus(value: unknown): ApplicationStatus {
  return value === "contacted" || value === "scheduled" || value === "new" ? value : "new";
}

async function readStatus(request: Request) {
  try {
    const body = (await request.json()) as { status?: unknown };
    return asStatus(body.status) === body.status ? asStatus(body.status) : null;
  } catch {
    return null;
  }
}

function isId(id: string) {
  return /^[0-9a-f-]{36}$/i.test(id);
}

function isStored(value: unknown): value is StoredApplication {
  if (!value || typeof value !== "object") return false;
  const item = value as StoredApplication;
  return typeof item.id === "string" && typeof item.submittedAt === "string" && Array.isArray(item.photos);
}

function isPhoto(value: unknown): value is StoredPhoto {
  if (!value || typeof value !== "object") return false;
  const photo = value as StoredPhoto;
  return typeof photo.key === "string" && typeof photo.name === "string" && typeof photo.type === "string";
}

function isPhotoKey(id: string, key: string) {
  return new RegExp(`^applications/${id}/[0-4]\\.(jpg|png)$`).test(key);
}

function sniff(bytes: Uint8Array) {
  if (bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes.length > 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return "image/png";
  }
  return "";
}

function typeFor(key: string) {
  return key.endsWith(".png") ? "image/png" : "image/jpeg";
}

function json(body: unknown, status = 200) {
  const headers = new Headers({ "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  applySecurityHeaders(headers);
  return new Response(JSON.stringify(body), { status, headers });
}
