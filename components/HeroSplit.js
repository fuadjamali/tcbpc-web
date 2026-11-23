import { IconCheck, IconArrowRight } from "@tabler/icons-react";
import ProductStage from "@/components/ProductStage";
import { parseAccent, splitLines } from "@/lib/textLines";

// The "split" hero (hero_slides.layout = 'split'): the product stage on the left — first in the
// markup, so phones see the product before the copy — and copy + buttons on the right. The stage
// is a glass card holding components/ProductStage.js, fed by the chosen product's photos; cut-out
// photos float out over the top of the card. Badges (one per line on the slide) float beside it.
export default function HeroSplit({ slide, photos, stageName, sectionMaxW, heightPx }) {
  const trustPoints = splitLines(slide.trust_points);
  const badges = splitLines(slide.badges).slice(0, 2);
  const lead = (stageName || "").trim();

  return (
    <section
      className="relative isolate overflow-hidden bg-brand-deep text-white"
      style={{ order: -1, ...(heightPx ? { minHeight: heightPx } : {}) }}
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-teal/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-brand-teal/10 blur-3xl" />

      <div className={`relative mx-auto ${sectionMaxW} px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-10 lg:px-8 lg:py-20`}>
        <div className="grid grid-cols-1 items-center gap-6 sm:gap-12 lg:grid-cols-12">
          {photos.length > 0 && (
            <div className="pt-12 sm:pt-16 lg:col-span-5 lg:pt-10">
              <div className="relative rounded-[2rem] border border-white/15 bg-gradient-to-b from-white/10 to-white/5 px-5 pb-4 pt-2 shadow-2xl backdrop-blur-sm sm:px-8 sm:pb-6">
                {/* the stage starts above the card so cut-out photos break out over its top edge */}
                <div className="-mt-14 sm:-mt-20">
                  <ProductStage photos={photos} size={324}>
                    {badges[0] && (
                      <div className="absolute left-0 top-[38%] z-20 hidden items-center gap-1.5 rounded-full border border-brand-teal/40 bg-brand-ink/85 px-3 py-1.5 text-[11px] font-bold text-white shadow-lg backdrop-blur-md sm:flex">
                        <span className="h-2 w-2 animate-ping rounded-full bg-brand-teal" />
                        {badges[0]}
                      </div>
                    )}
                    {badges[1] && (
                      <div className="absolute bottom-6 right-0 z-20 hidden rounded-full border border-brand-teal/40 bg-brand-deep/95 px-3 py-1.5 text-[11px] font-bold text-brand-teal shadow-lg backdrop-blur-md sm:flex">
                        {badges[1]}
                      </div>
                    )}
                  </ProductStage>
                </div>
                {lead && (
                  <p className="mt-3 hidden text-center sm:block">
                    <span className="rounded-full bg-brand-ink/40 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-teal">
                      Flagship: {lead}
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-5 sm:space-y-6 lg:col-span-7">
            {slide.eyebrow && (
              <div className="inline-flex items-center rounded-full border border-brand-teal/30 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-brand-teal sm:text-sm">
                {slide.eyebrow}
              </div>
            )}

            <h1 className="text-3xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-[52px]">
              {parseAccent(slide.heading).map((part, i) => (
                <span key={i} className={part.accent ? "text-brand-teal" : undefined}>
                  {part.text}
                </span>
              ))}
            </h1>

            {slide.subheading && (
              <p className="max-w-2xl text-base leading-relaxed text-brand-cream/90 sm:text-lg">
                {slide.subheading}
              </p>
            )}

            <div className="flex flex-col items-stretch gap-4 pt-2 sm:flex-row sm:items-center">
              {slide.primary_cta_label && (
                <a
                  href={slide.primary_cta_href || "#"}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-teal px-7 py-4 text-base font-bold text-brand-ink shadow-xl shadow-brand-teal/20 transition hover:-translate-y-0.5 hover:bg-brand-teal-hover"
                >
                  <span>{slide.primary_cta_label}</span>
                  <IconArrowRight size={20} />
                </a>
              )}
              {slide.secondary_cta_label && (
                <a
                  href={slide.secondary_cta_href || "#"}
                  className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-base font-semibold text-white transition hover:bg-white/15"
                >
                  {slide.secondary_cta_label}
                </a>
              )}
            </div>

            {trustPoints.length > 0 && (
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-brand-cream/80 sm:text-sm">
                {trustPoints.map((point) => (
                  <li key={point} className="flex items-center gap-1.5">
                    <IconCheck size={16} className="text-brand-teal" />
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
