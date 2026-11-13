# PrimeFix Home & Handyman Services

Website for PrimeFix Home & Handyman Services LLC. Next.js 16.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Local public pages and `/admin` read production D1. Saves and image uploads are rejected, so local development cannot change production. Missing uploaded images are loaded read-only from the live site.

Set `CLOUDFLARE_ACCOUNT_ID` in `.env.local`. Copy admin secrets into `.env.local` and `.dev.vars`.  
`ADMIN_PASSWORD` ≥ 12 chars; `ADMIN_SESSION_SECRET` ≥ 32 random chars (`openssl rand -base64 48`). Changing either invalidates all admin sessions.

Privacy Policy and Messaging Terms stay in `src/features/legal/policies.json` and are not stored in D1. Yelp and Angi review text stays in the review data files and is not stored in D1.

The Worker build is `npm run preview`. Set `CMS_MEDIA_READONLY=1` in `.dev.vars` so preview can read production images. Do not deploy until the SSR app has been checked locally.

The registered business address is private and is not included in public site content.
