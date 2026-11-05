# PrimeFix Home & Handyman Services

Website for PrimeFix Home & Handyman Services LLC. Next.js 16.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` / `.dev.vars` and set admin secrets before using `/admin`.  
`ADMIN_PASSWORD` ≥ 12 chars; `ADMIN_SESSION_SECRET` ≥ 32 random chars (`openssl rand -base64 48`). Changing either invalidates all admin sessions.

Public company details live in `src/lib/site.ts`. Services, locations, gallery categories and legal page shells are in `src/lib/`.

The registered business address is private and is not included in public site content.
