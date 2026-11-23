// A "merchant activation" case-study card for the green portfolio band: badge pill + sector on
// top, the name, a hardware/solution line, the description, and a status/benefit footer. All
// fields are the portfolio_items columns edited at /admin/portfolio; every one is optional.
export default function PortfolioCaseCard({ item }) {
  const hasHeader = item.badge || item.sector;
  const hasFooter = item.status_text || item.benefit;
  const Tag = item.website_url ? "a" : "div";
  const linkProps = item.website_url
    ? { href: item.website_url, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Tag
      {...linkProps}
      className="flex flex-col justify-between rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm"
    >
      <div>
        {hasHeader && (
          <div className="mb-4 flex items-center justify-between gap-2">
            {item.badge ? (
              <span className="rounded-full bg-brand-teal px-3 py-1 text-xs font-bold text-brand-ink">
                {item.badge}
              </span>
            ) : (
              <span />
            )}
            {item.sector && (
              <span className="text-xs font-medium text-brand-cream/75">{item.sector}</span>
            )}
          </div>
        )}
        <h3 className="text-xl font-extrabold text-white">{item.name}</h3>
        {item.solution && (
          <p className="mt-1 text-xs font-semibold text-brand-teal">Hardware: {item.solution}</p>
        )}
        {item.description && (
          <p className="mt-3 text-sm leading-relaxed text-white/85">{item.description}</p>
        )}
      </div>
      {hasFooter && (
        <div className="mt-6 flex items-center justify-between gap-2 border-t border-white/10 pt-4 text-xs text-brand-cream/75">
          <span>{item.status_text}</span>
          <span className="font-semibold text-brand-teal">{item.benefit}</span>
        </div>
      )}
    </Tag>
  );
}
