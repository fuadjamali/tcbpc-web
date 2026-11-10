// Pure (no DB) display options for the home page "Our Work" cards — shared by the admin form,
// the admin list, and the public card. Tailwind needs whole class strings to be present in
// source, so each size lists its complete classes rather than building them from parts.
//
// Grid: 6 columns on phones/tablets, 12 on large screens.
//   large  = today's look (3 across on desktop, 2 on tablet, 1 on phone)
//   medium = 4 across on desktop, 3 on tablet, 2 on phone
//   small  = 6 across on desktop, 3 on tablet, 3 on phone — meant for logos
// Live website previews need room to be readable, so they use wider spans than a plain image.
export const PORTFOLIO_SIZES = {
  small: {
    label: "Small",
    hint: "6 across — logos",
    imageSpan: "col-span-2 lg:col-span-2",
    liveSpan: "col-span-6 sm:col-span-3 lg:col-span-4",
  },
  medium: {
    label: "Medium",
    hint: "4 across",
    imageSpan: "col-span-3 sm:col-span-2 lg:col-span-3",
    liveSpan: "col-span-6 sm:col-span-3 lg:col-span-4",
  },
  large: {
    label: "Large",
    hint: "3 across — photos",
    imageSpan: "col-span-6 sm:col-span-3 lg:col-span-4",
    liveSpan: "col-span-6 lg:col-span-6",
  },
};

export const DEFAULT_PORTFOLIO_SIZE = "large";

export function normalizePortfolioSize(value) {
  return Object.hasOwn(PORTFOLIO_SIZES, value) ? value : DEFAULT_PORTFOLIO_SIZE;
}

// A live preview only renders when the admin switched it on, there's a link to show, the card is
// big enough to read (not Small), and the site was found to allow embedding at save time
// (previewEmbeddable === true — null/false both fall back to the image).
export function shouldShowLivePreview(item) {
  return Boolean(
    item.live_preview &&
      item.website_url &&
      item.image_size !== "small" &&
      item.preview_embeddable === true
  );
}
