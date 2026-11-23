# CLAUDE.md

Guidance for Claude Code when working in this repository.

@AGENTS.md

## What this is

"tcbpc-web" (package name `tcbpc-web`): a template/suite for small-business websites. Each client
gets their own deployment (own Vercel project, Neon Postgres, Vercel Blob store). It has a public
site, a Postgres-backed admin panel for nearly all content, and three pricing tiers enforced in code.

Stack: Next.js 16 (App Router) + React 19, Tailwind v4, raw `pg` (no ORM), NextAuth v4 (Credentials,
JWT) for admins, a separate HMAC-signed cookie for member login, Vercel Blob for images.

## Commands

```bash
docker-compose up -d        # local Postgres (host port 5436, see docker-compose.yml)
npm run dev                 # dev server
npm run dev:full            # start DB container + dev server together
npm run build               # production build
npm run lint
npm run seed                # create first admin (SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD)
npm run smoke-test          # route health + plan gating (BASE_URL, TEST_PLAN env vars)
npm run db:pull-prod        # pull production DB locally
npm run generate-identity -- --source logo.png
```

Env vars and deployment checklist: `docs/developer-notes.md`. Copy `.env.local.example` to `.env.local`.

## Next.js 16 gotchas

- Read `node_modules/next/dist/docs/` before writing Next code (see AGENTS.md).
- `middleware.js` is now `proxy.js` (repo root). It runs on the Edge runtime, so no `pg` there.
- `params` and `searchParams` are Promises: `const { slug } = await params`.
- Pages that query the DB per request need `export const dynamic = "force-dynamic"` or ISR (`revalidate`).

## Architecture rules that bite

- **Route allowlist (`proxy.js`)**: anything not explicitly public or protected returns 401 "Site Unavailable".
  Every new public or admin route must be added there (`PUBLIC_ROUTES`/`PUBLIC_PREFIXES`/
  `PROTECTED_ROUTES`/`PROTECTED_PREFIXES`), including static-asset extensions and extensionless routes.
- **Plan tiers (`PLAN` env: basic | plus | premium, default premium)**: `lib/plan.js` gates modules per route,
  nav and home sections. A new module must be wired into `lib/plan.js` (`CORE_MODULES`, `ANCHOR_MODULES`,
  `ADMIN_ROUTE_MODULES`, `NAV_HREF_MODULES`) and `lib/moduleSettings.js` (`MODULE_GROUPS`). Verify with
  `curl`/smoke-test, not by eyeballing prefixes. Keep `docs/package-plans.md` in sync.
- **No migrations directory**: each `lib/<feature>.js` has `ensureTable()` (`CREATE TABLE IF NOT EXISTS` +
  `ALTER TABLE ADD COLUMN IF NOT EXISTS`). Guard creation against races (swallow `23505`/`42P07`, or an
  advisory lock for seeded parent/child data). Change CHECK constraints by adding a new `_v2`-named one.
- **Feature shape**: `lib/<feature>.js` + `app/admin/(protected)/<feature>/` (list, new, `[id]` detail,
  `[id]/edit`, `actions.js` Server Actions) + shared `components/<Feature>Form.js`. Mutations call
  `revalidatePath` for every public route showing the data, delete uses `DeleteButton` confirmation,
  images use `ImageFileInput` + `lib/blob.js`.
- **Content is DB-backed**; `config/site.js` only keeps a few static keys. Set an optional section to `null` to remove it.
- **Never nest `<form>`** (e.g. the AI button calls its server action directly).
- **Cookies** can't be modified in Server Components; use `redirect()` or a Server Action.
- **Members**: public flows linking records to a member use `getActiveMemberSession()`, not `getMemberSession()`.
  Order/booking member ids are derived server-side, never from client input.
- **Dates**: compute "today" from local date parts, not `toISOString()`.
- **Full-bleed images** use `object-contain object-bottom` below `sm:`, not `object-cover`.
- **Theming**: use the theme tokens (`bg-primary`, `bg-surface`, `text-muted`, `border-border`), not hardcoded grays.
- **Testing Server Actions**: `curl` can't invoke them; use a real browser (`form.requestSubmit()`).

## Docs

All in `docs/`; keep them current when features change.

- `modules-blueprint.md`: full feature inventory (source of truth)
- `developer-notes.md`: env vars, tiers, deployment, architecture gotchas
- `package-plans.md`: client-facing tiers and pricing (`lib/planFeatures.js` holds the prices)
- `hero-partners-about-gallery-internals.md`, `site-content-sections-extended.md`, `team-people-internals.md`,
  `whatsapp-cta-internals.md`, `portfolio-links-sizes-previews.md`: per-feature internals
- `future-work.md`, `multilingual-i18n-plan.md`, `todo-live-site-launch.md`: backlog and plans
- `work-log.md`: reconstructed work history

`PLAN.md` is the original MVP build log and is historical; `README.md` covers first-time setup.
