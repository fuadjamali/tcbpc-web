import PortfolioLiveFrame from "@/components/PortfolioLiveFrame";
import {
  PORTFOLIO_SIZES,
  normalizePortfolioSize,
  shouldShowLivePreview,
} from "@/lib/portfolioDisplay";

// One "Our Work" card. Shows the project's image (cropped to fill for Large — the original look —
// and shown whole on white for Small/Medium, which suits logos), or a live preview of the linked
// site when the admin switched that on and the site allows embedding (see shouldShowLivePreview).
// When the project has a website link the whole card is a link that opens it in a new tab;
// otherwise it's a plain, non-clickable card exactly as before.
export default function PortfolioCard({ item }) {
  const size = normalizePortfolioSize(item.image_size);
  const live = shouldShowLivePreview(item);
  const span = live ? PORTFOLIO_SIZES[size].liveSpan : PORTFOLIO_SIZES[size].imageSpan;
  const showWhole = size !== "large";
  const label = item.name || "Website";

  const media = live ? (
    <PortfolioLiveFrame url={item.website_url} title={label} />
  ) : (
    <div
      className={`relative overflow-hidden ${
        showWhole ? "aspect-square bg-white p-[12%]" : "bg-gray-200 dark:bg-gray-800"
      }`}
    >
      {/* Admin-editable image source (Blob URL or local path) — plain <img> avoids next/image's
          hostname allowlist. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.image}
        alt={item.name || ""}
        loading="lazy"
        className={showWhole ? "h-full w-full object-contain" : "block h-auto w-full"}
      />
    </div>
  );

  const caption = item.name && (
    <figcaption
      className={`border-t border-border bg-surface-alt font-medium text-foreground ${
        size === "small" ? "px-2.5 py-2 text-xs" : "p-3 text-sm"
      }`}
    >
      {item.name}
    </figcaption>
  );

  const baseClasses = `${span} self-start overflow-hidden rounded-xl border border-border bg-surface shadow-sm`;

  if (!item.website_url) {
    return (
      <figure className={baseClasses}>
        {media}
        {caption}
      </figure>
    );
  }

  return (
    <figure className={`${baseClasses} group relative transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-within:-translate-y-0.5`}>
      <a
        href={item.website_url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label} (opens in a new tab)`}
        className="block focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {media}
        {caption}
        <span
          aria-hidden="true"
          className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-foreground/85 px-2.5 py-1 text-[11.5px] font-semibold text-background opacity-0 transition group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
        >
          Visit site
          <svg
            width="11"
            height="11"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            <path d="M8 4H4v12h12v-4M11 3h6v6M17 3l-8 8" />
          </svg>
        </span>
      </a>
    </figure>
  );
}
