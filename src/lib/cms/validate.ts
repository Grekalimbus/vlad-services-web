import type { CmsDocument } from "./types";

const REQUIRED = [
  "version",
  "site",
  "ctas",
  "nav",
  "footerNav",
  "legalNav",
  "trustItems",
  "faqs",
  "serviceCategories",
  "services",
  "servicePackages",
  "galleryCategories",
  "galleryItems",
  "legalPages",
  "googleReviews",
  "copy",
] as const;

const MAX_BYTES = 900_000;
const MAX_STRING = 20_000;
const MAX_ARRAY = 400;
const MAX_DEPTH = 12;

export function validateDocument(input: unknown): CmsDocument {
  const encoded = JSON.stringify(input);
  if (!encoded || encoded.length > MAX_BYTES) {
    throw new Error("Content is too large.");
  }
  walk(input, 0);
  if (!input || typeof input !== "object") throw new Error("Content must be an object.");
  const document = input as Record<string, unknown>;
  if (document.version !== 1) throw new Error("Unsupported content version.");
  for (const key of REQUIRED) {
    if (!(key in document)) throw new Error(`Missing ${key}.`);
  }
  return input as CmsDocument;
}

function walk(value: unknown, depth: number) {
  if (depth > MAX_DEPTH) throw new Error("Content is nested too deeply.");
  if (typeof value === "string") {
    if (value.length > MAX_STRING) throw new Error("A text field is too long.");
    return;
  }
  if (value == null || typeof value === "number" || typeof value === "boolean") return;
  if (Array.isArray(value)) {
    if (value.length > MAX_ARRAY) throw new Error("A list is too long.");
    for (const item of value) walk(item, depth + 1);
    return;
  }
  if (typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      if (key === "__proto__" || key === "prototype" || key === "constructor") {
        throw new Error("Invalid field name.");
      }
      walk(item, depth + 1);
    }
    return;
  }
  throw new Error("Content contains an unsupported value.");
}

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function inspectImage(bytes: Uint8Array, declaredType: string) {
  const type = sniff(bytes);
  if (!type || !IMAGE_TYPES[type]) throw new Error("Upload a JPEG, PNG, WebP, or GIF image.");
  if (declaredType && declaredType !== type && declaredType !== "application/octet-stream") {
    throw new Error("The file contents do not match its type.");
  }
  if (bytes.byteLength > 8 * 1024 * 1024) throw new Error("Images must be 8 MB or smaller.");
  return { type, extension: IMAGE_TYPES[type] };
}

function sniff(bytes: Uint8Array) {
  if (bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes.length > 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return "image/png";
  }
  if (bytes.length > 6 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return "image/gif";
  if (
    bytes.length > 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  return "";
}

export function mediaKey(key: string) {
  if (!/^uploads\/[a-zA-Z0-9-]+\.(jpg|png|webp|gif)$/.test(key)) {
    throw new Error("Invalid media key.");
  }
  return key;
}

export function publicMediaPath(key: string) {
  return `/api/media/${key}`;
}
