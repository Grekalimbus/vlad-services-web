import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { CmsUnavailableError } from "./errors";
import { localEnv } from "./local-env";
import type { CmsEnv } from "./types";

const execFileAsync = promisify(execFile);
const DATABASE_ID = "a7b9675c-46b4-481e-a7ce-447985f5b63b";
const DATABASE_NAME = "primefixpros-content";

async function cloudflareToken() {
  const explicit = process.env.CLOUDFLARE_API_TOKEN?.trim();
  if (explicit) return explicit;
  const text = await readFile(join(homedir(), "Library/Preferences/.wrangler/config/default.toml"), "utf8");
  const token = text.match(/^oauth_token\s*=\s*"(.*)"$/m)?.[1];
  if (!token) throw new CmsUnavailableError("Cloudflare credentials for read-only CMS access were not found.");
  return token;
}

function isAuthFailure(message: string, status?: number) {
  if (status === 401 || status === 403) return true;
  return /auth|token|unauthorized|forbidden|7403/i.test(message);
}

async function queryProductionHttp(sql: string, params: unknown[]) {
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
    const error = new CmsUnavailableError(message || "Production CMS could not be read.");
    (error as CmsUnavailableError & { auth?: boolean }).auth = isAuthFailure(message || "", response.status);
    throw error;
  }
  return payload.result?.[0]?.results ?? [];
}

/** Wrangler refreshes OAuth when the raw HTTP token is stale. */
async function querySiteBodyViaWrangler() {
  try {
    const { stdout, stderr } = await execFileAsync(
      "npx",
      ["wrangler", "d1", "execute", DATABASE_NAME, "--remote", "--json", "--command", "SELECT body FROM documents WHERE id = 'site'"],
      {
        cwd: process.cwd(),
        maxBuffer: 20 * 1024 * 1024,
        env: process.env,
        timeout: 60_000,
      },
    );
    const text = `${stdout}\n${stderr}`;
    const start = text.indexOf("[");
    if (start < 0) throw new Error("Wrangler returned no JSON.");
    const payload = JSON.parse(text.slice(start)) as { results?: { body?: string }[] }[];
    return payload[0]?.results ?? [];
  } catch (error) {
    const message = error instanceof Error ? error.message : "Wrangler CMS read failed.";
    throw new CmsUnavailableError(message);
  }
}

async function queryProduction(sql: string, params: unknown[]) {
  try {
    return await queryProductionHttp(sql, params);
  } catch (error) {
    const auth = Boolean((error as { auth?: boolean }).auth);
    if (!auth) throw error;
    // Only the site document is needed for local Next.js; route auth failures through Wrangler.
    if (sql.includes("documents") && sql.includes("body")) {
      return querySiteBodyViaWrangler();
    }
    throw error;
  }
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
