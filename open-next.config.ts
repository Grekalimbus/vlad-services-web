import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No incremental cache. CMS pages are rendered from D1 on each request.
export default defineCloudflareConfig();
