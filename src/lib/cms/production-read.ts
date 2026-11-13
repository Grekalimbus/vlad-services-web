import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { CmsUnavailableError } from "./errors";
import { localEnv } from "./local-env";
import type { CmsEnv } from "./types";

const DATABASE_ID = "a7b9675c-46b4-481e-a7ce-447985f5b63b";

async function cloudflareToken() {
  const explicit = process.env.CLOUDFLARE_API_TOKEN?.trim();
  if (explicit) return explicit;
  const text = await readFile(join(homedir(), "Library/Preferences/.wrangler/config/default.toml"), "utf8");
  const token = text.match(/^oauth_token\s*=\s*"(.*)"$/m)?.[1];
  if (!token) throw new CmsUnavailableError("Cloudflare credentials for read-only CMS access were not found.");
  return token;
}

async function queryProduction(sql: string, params: unknown[]) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  if (!accountId) {
    throw new CmsUnavailableError("Set CLOUDFLARE_ACCOUNT_ID to read the production CMS. Nothing was written.");
  }
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID?.trim() || DATABASE_ID;
  const token = await cloudflareToken();
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ sql, params }),
      cache: "no-store",
    },
  );
  const payload = (await response.json()) as {
    success?: boolean;
    errors?: { message?: string }[];
    result?: { results?: { body?: string }[] }[];
  };
  if (!response.ok || payload.success === false) {
    const message = payload.errors?.map((error) => error.message).filter(Boolean).join("; ");
    throw new CmsUnavailableError(message || "Production CMS could not be read.");
  }
  return payload.result?.[0]?.results ?? [];
}

/** Reads production D1. This object has no write methods. */
export function productionReadEnv(): CmsEnv {
  const local = localEnv();
  return {
    readOnly: true,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
    readLocal: async () => {
      const rows = await queryProduction("SELECT body FROM documents WHERE id = ?", ["site"]);
      const body = rows[0]?.body;
      if (!body) throw new CmsUnavailableError("The CMS document is missing from the production database.");
      return JSON.parse(body);
    },
    readApplications: local.readApplications,
    writeApplications: local.writeApplications,
  };
}
