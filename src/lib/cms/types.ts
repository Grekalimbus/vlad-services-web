import type defaultDocument from "./default-document.json";

export type CmsDocument = typeof defaultDocument;

export type CmsEnv = {
  CMS_DB?: D1Like;
  CMS_MEDIA?: R2Like;
  CMS_MEDIA_KV?: MediaKv;
  ADMIN_PASSWORD?: string;
  ADMIN_SESSION_SECRET?: string;
  CF_ACCESS_TEAM_DOMAIN?: string;
  CF_ACCESS_AUD?: string;
  readLocal?: () => Promise<unknown>;
  writeLocal?: (document: CmsDocument) => Promise<void>;
  putMedia?: (key: string, bytes: Uint8Array, type: string) => Promise<void>;
  getMedia?: (key: string) => Promise<{ bytes: Uint8Array; type: string } | null>;
  deleteMedia?: (key: string) => Promise<void>;
  listMedia?: () => Promise<{ key: string; src: string }[]>;
  readApplications?: () => Promise<unknown>;
  writeApplications?: (rows: unknown) => Promise<void>;
};

type D1Like = {
  prepare: (sql: string) => {
    bind: (...values: unknown[]) => {
      first: <T>() => Promise<T | null>;
      all: <T>() => Promise<{ results?: T[] }>;
      run: () => Promise<unknown>;
    };
  };
};

type MediaKv = {
  getWithMetadata: (
    key: string,
    options: { type: "arrayBuffer" },
  ) => Promise<{ value: ArrayBuffer | null; metadata: { contentType?: string } | null }>;
  put: (
    key: string,
    value: ArrayBuffer | ArrayBufferView,
    options?: { metadata?: { contentType?: string } },
  ) => Promise<void>;
  delete: (key: string) => Promise<void>;
  list: (options?: { prefix?: string; cursor?: string }) => Promise<{
    keys: { name: string }[];
    list_complete: boolean;
    cursor?: string;
  }>;
};

type R2Like = {
  put: (
    key: string,
    value: ArrayBuffer | ArrayBufferView,
    options?: { httpMetadata?: { contentType?: string } },
  ) => Promise<unknown>;
  get: (key: string) => Promise<{
    body: ReadableStream | null;
    httpMetadata?: { contentType?: string };
    arrayBuffer?: () => Promise<ArrayBuffer>;
  } | null>;
  delete: (key: string) => Promise<void>;
  list?: (options?: { prefix?: string; cursor?: string }) => Promise<{
    objects: { key: string }[];
    truncated?: boolean;
    cursor?: string;
  }>;
};
