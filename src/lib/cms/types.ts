import type defaultDocument from "./default-document.json";

export type CmsReview = {
  id: string;
  author: string;
  dateLabel: string;
  rating: number;
  quote: string;
};

export type CmsReviewListing = {
  name?: string;
  rating: number | null;
  reviewCount: number;
  profileUrl: string;
  writeReviewUrl: string;
};

export type CmsDocument = typeof defaultDocument & {
  yelpListing?: CmsReviewListing;
  yelpReviews?: CmsReview[];
  angiReviews?: CmsReview[];
  bbbListing?: CmsReviewListing;
  bbbReviews?: CmsReview[];
};

export type CmsEnv = {
  CMS_DB?: D1Like;
  CMS_MEDIA?: R2Like;
  CMS_MEDIA_KV?: MediaKv;
  ADMIN_PASSWORD?: string;
  ADMIN_SESSION_SECRET?: string;
  CF_ACCESS_TEAM_DOMAIN?: string;
  CF_ACCESS_AUD?: string;
  /** Local viewing of production. Writes throw before any network call. */
  readOnly?: boolean;
  /** Worker preview may read production images without writing to R2. */
  mediaReadonly?: boolean;
  CMS_MEDIA_READONLY?: string;
  /** Local Next.js reads the production document through this function. It is not a file. */
  readLocal?: () => Promise<unknown>;
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
