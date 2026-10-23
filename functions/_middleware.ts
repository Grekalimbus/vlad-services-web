import { loadDocument } from "../src/lib/cms/content-store";
import { applySecurityHeaders } from "../src/lib/form-guard";
import { getPath } from "../src/lib/cms/read";
import { normalizeCms, normalizePath, pageMeta, redirectTarget } from "../src/lib/seo";
import type { CmsEnv } from "../src/lib/cms/types";

type RewriterElement = {
  getAttribute: (name: string) => string | null;
  setAttribute: (name: string, value: string) => void;
  setInnerContent: (content: string, options?: { html?: boolean }) => void;
  removeAttribute: (name: string) => void;
  remove: () => void;
};

type Rewriter = {
  on: (selector: string, handlers: { element?: (element: RewriterElement) => void }) => Rewriter;
  transform: (response: Response) => Response;
};

declare const HTMLRewriter: new () => Rewriter;

export async function onRequest(context: {
  request: Request;
  env: CmsEnv;
  next: () => Promise<Response>;
}) {
  const url = new URL(context.request.url);
  const path = normalizePath(url.pathname);
  const asset = path.startsWith("/_next") || /\.(?:css|js|mjs|map|jpg|jpeg|png|webp|gif|svg|ico|woff2?|ttf|txt|xml|json|webmanifest)$/i.test(url.pathname);

  if (asset) return guard(await context.next(), context.request);
  if (path.startsWith("/admin") || path.startsWith("/api")) {
    return guard(await context.next(), context.request, "noindex, nofollow");
  }

  const early = redirectTarget(path);
  if (early) {
    const target = early === "/" ? "/" : `${early.replace(/\/$/, "")}/`;
    return guard(Response.redirect(new URL(`${target}${url.search}`, url.origin), 301), context.request);
  }

  let document;
  try {
    document = normalizeCms(await loadDocument(context.env));
  } catch {
    document = undefined;
  }

  const destination = document ? redirectTarget(path, document) : null;
  if (destination) {
    const target = destination === "/" ? "/" : `${destination.replace(/\/$/, "")}/`;
    return guard(Response.redirect(new URL(`${target}${url.search}`, url.origin), 301), context.request);
  }

  const response = await context.next();

  const type = response.headers.get("content-type") ?? "";
  if (!type.includes("text/html")) return guard(response, context.request, response.status === 404 ? "noindex, nofollow" : undefined);
  if (!document) return guard(response, context.request, response.status === 404 ? "noindex, nofollow" : undefined);

  const meta = pageMeta(response.status === 404 ? "/404" : path, document);
  const robots = response.status === 404 || !meta.index ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
  const payload = JSON.stringify(document).replaceAll("<", "\\u003c");
  const jsonLd = JSON.stringify(meta.jsonLd).replace(/</g, "\\u003c");
  const headers = new Headers(response.headers);
  headers.set("cache-control", "private, no-store");
  applySecurityHeaders(headers);
  if (!meta.index || response.status === 404) headers.set("x-robots-tag", "noindex, nofollow");
  if (url.protocol === "https:") headers.set("strict-transport-security", "max-age=31536000; includeSubDomains");

  const rewritten = new HTMLRewriter()
    .on("script#cms-data", {
      element(element) {
        element.setInnerContent(`window.__CMS__=${payload}`, { html: false });
      },
    })
    .on("[data-cms]", {
      element(element) {
        replaceText(element, document);
      },
    })
    .on("[data-cms-src]", {
      element(element) {
        replaceSource(element, document);
      },
    })
    .on("head > title", {
      element(element) {
        element.setInnerContent(meta.title, { html: false });
      },
    })
    .on('meta[name="description"]', {
      element(element) {
        element.setAttribute("content", meta.description);
      },
    })
    .on('meta[name="robots"]', {
      element(element) {
        element.setAttribute("content", robots);
      },
    })
    .on('meta[property="og:title"], meta[name="twitter:title"]', {
      element(element) {
        element.setAttribute("content", meta.title);
      },
    })
    .on('meta[property="og:description"], meta[name="twitter:description"]', {
      element(element) {
        element.setAttribute("content", meta.description);
      },
    })
    .on('meta[property="og:url"]', {
      element(element) {
        if (meta.canonical) element.setAttribute("content", meta.canonical);
        else element.remove();
      },
    })
    .on('link[rel="canonical"]', {
      element(element) {
        if (meta.canonical) element.setAttribute("href", meta.canonical);
        else element.remove();
      },
    })
    .on('meta[property="og:image"], meta[property="og:image:secure_url"], meta[name="twitter:image"]', {
      element(element) {
        element.setAttribute("content", meta.image);
      },
    })
    .on('meta[property="og:image:alt"]', {
      element(element) {
        element.setAttribute("content", meta.imageAlt);
      },
    })
    .on("script#json-ld", {
      element(element) {
        if (jsonLd !== "{}") element.setInnerContent(jsonLd, { html: false });
      },
    })
    .transform(new Response(response.body, { status: response.status, headers }));
  return rewritten;
}

function guard(response: Response, request?: Request, robots?: string) {
  const headers = new Headers(response.headers);
  applySecurityHeaders(headers);
  if (robots) headers.set("x-robots-tag", robots);
  if (request && new URL(request.url).protocol === "https:") {
    headers.set("strict-transport-security", "max-age=31536000; includeSubDomains");
  }
  const path = request ? normalizePath(new URL(request.url).pathname) : "";
  if (path.startsWith("/admin") || path.startsWith("/api")) headers.set("x-robots-tag", "noindex, nofollow");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function replaceText(element: RewriterElement, document: unknown) {
  const path = element.getAttribute("data-cms");
  if (!path) return;
  const value = getPath(document, path);
  if (typeof value === "string" || typeof value === "number") {
    element.setInnerContent(String(value), { html: false });
  }
}

function replaceSource(element: RewriterElement, document: unknown) {
  const path = element.getAttribute("data-cms-src");
  const altPath = element.getAttribute("data-cms-alt");
  if (path) {
    const value = getPath(document, path);
    if (typeof value === "string") {
      element.setAttribute("src", value);
      element.removeAttribute("srcset");
    }
  }
  if (altPath) {
    const value = getPath(document, altPath);
    if (typeof value === "string") element.setAttribute("alt", value);
  }
}
