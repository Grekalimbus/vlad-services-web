/**
 * Upload 10 neutral placeholder photos for the Outdoor deal and store them
 * on that deal only. Skips the write when the deal already has photos.
 *
 * Dry-run: node scripts/apply-outdoor-deal-photos.mjs
 * Apply:   node scripts/apply-outdoor-deal-photos.mjs --apply
 */
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { homedir } from "node:os";
import { join } from "node:path";
import { deflateSync } from "node:zlib";

const APPLY = process.argv.includes("--apply");
const DATABASE_ID = "a7b9675c-46b4-481e-a7ce-447985f5b63b";
const COUNT = 10;
const WIDTH = 1280;
const HEIGHT = 800;

const GLYPHS = {
  0: ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  1: ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  2: ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  3: ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  4: ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  5: ["11111", "10000", "10000", "11110", "00001", "00001", "11110"],
  6: ["01110", "10000", "10000", "11110", "10001", "10001", "01110"],
  7: ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  8: ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  9: ["01110", "10001", "10001", "01111", "00001", "00001", "01110"],
};

function envValue(name) {
  const fromProcess = process.env[name]?.trim();
  if (fromProcess) return fromProcess;
  try {
    const text = readFileSync(".env.local", "utf8");
    const match = text.match(new RegExp(`^${name}=(.*)$`, "m"));
    return match?.[1]?.trim() || "";
  } catch {
    return "";
  }
}

async function cloudflareToken() {
  const explicit = envValue("CLOUDFLARE_API_TOKEN");
  if (explicit) return explicit;
  const text = readFileSync(join(homedir(), "Library/Preferences/.wrangler/config/default.toml"), "utf8");
  const token = text.match(/^oauth_token\s*=\s*"(.*)"$/m)?.[1];
  if (!token) throw new Error("Cloudflare credentials were not found.");
  return token;
}

async function queryD1(sql, params = []) {
  const accountId = envValue("CLOUDFLARE_ACCOUNT_ID");
  if (!accountId) throw new Error("Set CLOUDFLARE_ACCOUNT_ID.");
  const databaseId = envValue("CLOUDFLARE_D1_DATABASE_ID") || DATABASE_ID;
  const token = await cloudflareToken();
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ sql, params }),
    },
  );
  const payload = await response.json();
  if (!response.ok || payload.success === false) {
    const message = payload.errors?.map((error) => error.message).filter(Boolean).join("; ");
    throw new Error(message || `D1 query failed (${response.status})`);
  }
  return payload.result?.[0] ?? { results: [], meta: {} };
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([length, typeBuf, data, crc]);
}

function paint(raw, width, x, y, rgb) {
  if (x < 0 || y < 0 || x >= width || y >= HEIGHT) return;
  const offset = y * (1 + width * 3) + 1 + x * 3;
  raw[offset] = rgb[0];
  raw[offset + 1] = rgb[1];
  raw[offset + 2] = rgb[2];
}

function placeholderPng(number) {
  const background = [214 + (number % 3) * 6, 222 + (number % 2) * 4, 230];
  const ink = [150, 162, 174];
  const stride = 1 + WIDTH * 3;
  const raw = Buffer.alloc(stride * HEIGHT);
  for (let y = 0; y < HEIGHT; y += 1) {
    raw[y * stride] = 0;
    for (let x = 0; x < WIDTH; x += 1) paint(raw, WIDTH, x, y, background);
  }
  const frame = 36;
  for (let x = frame; x < WIDTH - frame; x += 1) {
    paint(raw, WIDTH, x, frame, ink);
    paint(raw, WIDTH, x, HEIGHT - frame - 1, ink);
  }
  for (let y = frame; y < HEIGHT - frame; y += 1) {
    paint(raw, WIDTH, frame, y, ink);
    paint(raw, WIDTH, WIDTH - frame - 1, y, ink);
  }
  const digits = String(number);
  const scale = 28;
  const glyphWidth = 5 * scale;
  const gap = scale;
  const total = digits.length * glyphWidth + (digits.length - 1) * gap;
  let cursor = Math.round((WIDTH - total) / 2);
  const top = Math.round((HEIGHT - 7 * scale) / 2);
  for (const digit of digits) {
    const rows = GLYPHS[digit];
    rows.forEach((row, rowIndex) => {
      [...row].forEach((cell, column) => {
        if (cell !== "1") return;
        for (let py = 0; py < scale; py += 1) {
          for (let px = 0; px < scale; px += 1) {
            paint(raw, WIDTH, cursor + column * scale + px, top + rowIndex * scale + py, ink);
          }
        }
      });
    });
    cursor += glyphWidth + gap;
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(WIDTH, 0);
  ihdr.writeUInt32BE(HEIGHT, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", deflateSync(raw)),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function serviceDeal(item) {
  const id = String(item?.id || "");
  return id === "tv-mounting" || id === "electrical" || id === "handyman" || id === "landscaping" || id === "landscaper";
}

const select = await queryD1("SELECT body, updated_at FROM documents WHERE id = ?", ["site"]);
const row = select.results?.[0];
if (!row?.body) {
  console.error("CMS document missing from D1.");
  process.exit(1);
}

const document = JSON.parse(row.body);
const items = document.copy?.dealsPage?.items;
if (!Array.isArray(items)) {
  console.error("copy.dealsPage.items is missing.");
  process.exit(1);
}

let index = items.findIndex(
  (item) => !serviceDeal(item) && /outdoor|seasonal|holiday/i.test(`${item?.id || ""} ${item?.title || ""}`),
);
if (index < 0) {
  for (let cursor = items.length - 1; cursor >= 0; cursor -= 1) {
    if (!serviceDeal(items[cursor])) {
      index = cursor;
      break;
    }
  }
}
if (index < 0) {
  console.error("Outdoor deal was not found.");
  process.exit(1);
}

const deal = items[index];
const existing = Array.isArray(deal.photos) ? deal.photos.filter((photo) => photo && photo.image) : [];
console.log(
  JSON.stringify(
    {
      index,
      id: deal.id,
      title: deal.title,
      existingPhotos: existing.length,
    },
    null,
    2,
  ),
);

if (existing.length > 0) {
  console.log("Outdoor deal already has photos. Nothing was changed.");
  process.exit(0);
}

const dir = mkdtempSync(join(tmpdir(), "outdoor-deal-"));
const photos = Array.from({ length: COUNT }, (_, offset) => {
  const number = offset + 1;
  const key = `uploads/${randomUUID()}.png`;
  const file = join(dir, `${number}.png`);
  writeFileSync(file, placeholderPng(number));
  return {
    key,
    file,
    image: `/api/media/${key}`,
    alt: `Photo ${number}`,
    position: "center",
  };
});

console.log(JSON.stringify({ upload: photos.map((photo) => photo.image) }, null, 2));

if (!APPLY) {
  console.log("Dry-run only. Re-run with --apply to upload R2 and write production D1.");
  process.exit(0);
}

for (const photo of photos) {
  console.log("uploading", photo.key);
  const result = spawnSync(
    "npx",
    [
      "wrangler",
      "r2",
      "object",
      "put",
      `primefixpros-media/${photo.key}`,
      "--file",
      photo.file,
      "--content-type",
      "image/png",
      "--remote",
    ],
    { encoding: "utf8", cwd: process.cwd() },
  );
  if (result.status !== 0) {
    console.error(result.stdout, result.stderr);
    throw new Error(`R2 upload failed for ${photo.key}`);
  }
}

const next = structuredClone(document);
next.copy.dealsPage.items[index].photos = photos.map((photo) => ({
  image: photo.image,
  alt: photo.alt,
  position: photo.position,
}));
const updatedAt = new Date().toISOString();
await queryD1("UPDATE documents SET body = ?, updated_at = ? WHERE id = ?", [
  JSON.stringify(next),
  updatedAt,
  "site",
]);

const verify = await queryD1(
  "SELECT json_extract(body, ?) AS photos FROM documents WHERE id = ?",
  [`$.copy.dealsPage.items[${index}].photos`, "site"],
);
const stored = JSON.parse(verify.results?.[0]?.photos || "[]");
console.log(JSON.stringify({ updatedAt, stored: stored.length, first: stored[0]?.image || "" }, null, 2));
