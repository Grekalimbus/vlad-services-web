import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CmsDocument, CmsEnv } from "./types";
import { publicMediaPath } from "./validate";

const root = () => path.join(process.cwd(), ".cms");

export function localEnv(): CmsEnv {
  return {
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
    CF_ACCESS_TEAM_DOMAIN: process.env.CF_ACCESS_TEAM_DOMAIN,
    CF_ACCESS_AUD: process.env.CF_ACCESS_AUD,
    readLocal: async () => JSON.parse(await readFile(path.join(root(), "content.json"), "utf8")),
    writeLocal: async (document: CmsDocument) => {
      await mkdir(root(), { recursive: true });
      await writeFile(path.join(root(), "content.json"), JSON.stringify(document));
    },
    putMedia: async (key, bytes) => {
      const file = path.join(root(), "media", key);
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, bytes);
    },
    getMedia: async (key) => {
      try {
        const bytes = await readFile(path.join(root(), "media", key));
        return { bytes, type: typeFor(key) };
      } catch {
        return null;
      }
    },
    deleteMedia: async (key) => {
      await rm(path.join(root(), "media", key), { force: true });
    },
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
    listMedia: async () => {
      try {
        const names = await readdir(path.join(root(), "media", "uploads"));
        return names
          .filter((name) => /\.(jpe?g|png|webp|gif)$/i.test(name))
          .map((name) => {
            const key = `uploads/${name}`;
            return { key, src: publicMediaPath(key) };
          });
      } catch {
        return [];
      }
    },
  };
}

function typeFor(key: string) {
  if (key.endsWith(".png")) return "image/png";
  if (key.endsWith(".webp")) return "image/webp";
  if (key.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
}
