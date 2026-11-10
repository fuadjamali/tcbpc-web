# Portfolio: website link, card size, live preview

Each portfolio project (the home page "Our Work" section, edited at `/admin/portfolio`) has three
optional display settings, all with defaults that leave existing projects looking exactly as
before.

| Setting | Column | Default | Effect |
|---|---|---|---|
| Website link | `website_url` | none | The whole card links to it, opening in a new tab (`rel="noopener noreferrer"`), with a "Visit site" cue on hover. No link = plain, non-clickable card. |
| Image size | `image_size` | `large` | `small` / `medium` / `large` — how wide the card is in the grid (see below). |
| Live website preview | `live_preview`, `preview_embeddable` | off | Shows the linked site inside a small browser-window frame instead of the image. |

## Sizes

The grid is 6 columns (12 on large screens); each card spans by its size
(`lib/portfolioDisplay.js`).

- **Large** — original look: 3 across on desktop, 2 on tablet, 1 on phone; image cropped to fill.
- **Medium** — 4 across on desktop; image shown whole on white.
- **Small** — 6 across on desktop; image shown whole on white. Meant for logos.

Small and Medium show the whole image (`object-contain` with padding) so logos aren't cropped.

## Link handling

`lib/websiteUrl.js` `normalizeWebsiteUrl()` runs both in the admin form (as you type, blocking
submit with a message) and in the save action. It adds `https://` when missing and rejects anything
that isn't plain http/https (`javascript:`, `data:`, `mailto:`…), has credentials, spaces, or no
real hostname. An invalid link can never be stored.

## Live preview — how it decides

A preview renders only when **all** are true (`shouldShowLivePreview()`):

1. the switch is on, 2. there's a link, 3. the size is Medium or Large (Small is too tiny),
4. `preview_embeddable` is `true`.

Otherwise the project's normal image is shown — no broken box.

**`preview_embeddable`** is worked out once, when an admin saves with the switch on
(`lib/websiteLink.js` `checkEmbeddable()`): it fetches the site and reads `X-Frame-Options` and
CSP `frame-ancestors`. Sites that send either (Google, BBC…) are marked `false`; unreachable or
unknown sites are `null` (treated as "don't embed"). The public page never makes this request, so
it adds no latency. It is **re-checked on every save**; a site that changes its headers later won't
be noticed until someone re-saves the project. Private/loopback addresses are refused (admin-only
action, but it shouldn't be usable to probe internal services).

The admin list shows each project's size, link and preview status (including "showing image"
with the reason), and the edit form shows the result of the last check.

## Trade-offs to remember

- A live preview loads a whole third-party website. It's only loaded once the card scrolls near
  the viewport (`IntersectionObserver`), and the frame is sandboxed (`allow-scripts
  allow-same-origin` — scripts run, but the page can't navigate, open popups or reach ours) and
  non-interactive. Still, keep to a handful per page.
- The embedded site's own scripts/cookies run on the page; consider this against the cookie
  banner wording if previews are used heavily.
- The preview shows the site as it is *now*, including if it changes or breaks.
- On phones the preview isn't interactive; tapping opens the site.

## Files

`lib/portfolio.js` (columns + queries) · `lib/portfolioDisplay.js` (sizes, preview rule) ·
`lib/websiteUrl.js` (link cleaning, browser-safe) · `lib/websiteLink.js` (embed check, server
only) · `components/PortfolioDisplayFields.js` (admin fields) · `components/PortfolioCard.js` and
`components/PortfolioLiveFrame.js` (public card) · `app/admin/(protected)/portfolio/*`.
The smoke test covers the pure rules and a DB round trip
(`checkPortfolioLinkSizePreview` in `scripts/smoke-test.js`).
