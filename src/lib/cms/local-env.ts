import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CmsEnv } from "./types";

const root = () => path.join(process.cwd(), ".cms");

/** Local lead storage only. CMS documents and media are not stored here. */
export function localEnv(): CmsEnv {
  return {
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
    CF_ACCESS_TEAM_DOMAIN: process.env.CF_ACCESS_TEAM_DOMAIN,
    CF_ACCESS_AUD: process.env.CF_ACCESS_AUD,
    readApplications: async () => {
      try {
        return JSON.parse(await readFile(path.join(root(), "applications.json"), "utf8"));
      } catch {
        return [];
      }
    },
    writeApplications: async (rows) => {
      await mkdir(root(), { recursive: true });
      await writeFile(path.join(root(), "applications.json"), JSON.stringify(rows));
    },
  };
}
