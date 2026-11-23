"use client";

import { useEffect, useRef, useState } from "react";
import { IconCheck, IconArrowRight } from "@tabler/icons-react";
import { parseAccent, splitLines } from "@/lib/textLines";

// The "split" hero (hero_slides.layout = 'split'): copy and buttons on the left, and on the right
// a product stage fed by the chosen product's photos (lib/productPhotos.js). Photos that carry a
// label (e.g. a finish name) become a toggle; each photo's caption is shown under the stage. The
// stage tilts with scroll position and the mouse (CSS 3D transforms only — no library), and is
// left static for visitors who prefer reduced motion.
export default function HeroSplit({ slide, photos, stageName, sectionMaxW, heightPx }) {
  const labelled = photos.filter((p) => p.label);
  const toggles = labelled.length > 1 ? labelled : [];
  const [activeId, setActiveId] = useState((toggles[0] || photos[0])?.id);
  const stageRef = useRef(null);
  const deviceRef = useRef(null);
  const glowRef = useRef(null);
  const shadowRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  const active = photos.find((p) => p.id === activeId) || photos[0];
  const trustPoints = splitLines(slide.trust_points);
  const badges = splitLines(slide.badges).slice(0, 2);
  const lead = (stageName || "").trim();

  useEffect(() => {
    const stage = stageRef.current;
    const device = deviceRef.current;
    if (!stage || !device) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    function update() {
      const rect = stage.getBoundingClientRect();
      const winH = window.innerHeight || 800;
      const progress = Math.max(
        -1,
        Math.min(1, (rect.top + rect.height / 2 - winH / 2) / (winH * 0.75))
      );
      const rotY = progress * -14 + mouse.current.x * 12;
      const rotX = progress * 8 - mouse.current.y * 10;
      const lift = progress * -18;
      device.style.transform = `translate3d(0, ${lift.toFixed(1)}px, 35px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg)`;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${(-rotY * 1.4).toFixed(1)}px, ${(lift * 0.6).toFixed(1)}px, -20px)`;
      }
      if (shadowRef.current) {
        shadowRef.current.style.transform = `translateX(${(-rotY * 1.2).toFixed(1)}px) scale(${(1 - Math.abs(progress) * 0.12).toFixed(2)})`;
      }
    }
    function onMove(e) {
      const rect = stage.getBoundingClientRect();
      mouse.current = {
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      };
      update();
    }
    function onLeave() {
      mouse.current = { x: 0, y: 0 };
      update();
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    stage.addEventListener("mousemove", onMove);
    stage.addEventListener("mouseleave", onLeave);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      stage.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section
      className="relative isolate overflow-hidden bg-brand-deep text-white"
      style={{ order: -1, ...(heightPx ? { minHeight: heightPx } : {}) }}
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-teal/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-brand-teal/10 blur-3xl" />

      <div className={`relative mx-auto ${sectionMaxW} px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:py-20`}>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
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

          {active && (
            <div className="lg:col-span-5" style={{ perspective: "1400px" }}>
              <div
                ref={stageRef}
                className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-2xl backdrop-blur-sm sm:p-8"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className="mb-5 flex items-center justify-between gap-2"
                  style={{ transform: "translateZ(20px)" }}
                >
                  {lead && (
                    <span className="rounded-full bg-brand-ink/40 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-teal">
                      Flagship: {lead}
                    </span>
                  )}
                  {toggles.length > 0 && (
                    <div
                      className="inline-flex rounded-full border border-white/10 bg-brand-ink/50 p-1"
                      role="group"
                      aria-label="Choose a finish"
                    >
                      {toggles.map((photo) => (
                        <button
                          key={photo.id}
                          type="button"
                          onClick={() => setActiveId(photo.id)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                            photo.id === active.id
                              ? "bg-brand-teal text-brand-ink"
                              : "text-white/80 hover:text-white"
                          }`}
                        >
                          {photo.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  className="relative flex min-h-[340px] items-center justify-center py-4"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div
                    ref={glowRef}
                    className="pointer-events-none absolute h-56 w-56 rounded-full bg-brand-teal/25 blur-3xl"
                    style={{ transform: "translateZ(-20px)" }}
                  />
                  {badges[0] && (
                    <div
                      className="absolute left-1 top-3 z-20 hidden items-center gap-1.5 rounded-full border border-brand-teal/40 bg-brand-ink/85 px-3 py-1.5 text-[11px] font-bold text-white shadow-lg backdrop-blur-md sm:flex"
                      style={{ transform: "translateZ(55px)" }}
                    >
                      <span className="h-2 w-2 animate-ping rounded-full bg-brand-teal" />
                      {badges[0]}
                    </div>
                  )}
                  {badges[1] && (
                    <div
                      className="absolute bottom-5 right-1 z-20 hidden rounded-full border border-brand-teal/40 bg-brand-deep/95 px-3 py-1.5 text-[11px] font-bold text-brand-teal shadow-lg backdrop-blur-md sm:flex"
                      style={{ transform: "translateZ(45px)" }}
                    >
                      {badges[1]}
                    </div>
                  )}

                  <div
                    ref={deviceRef}
                    className="relative w-64 will-change-transform sm:w-72"
                    style={{ transformStyle: "preserve-3d", transform: "translateZ(35px)" }}
                  >
                    <div className="relative overflow-hidden rounded-[32px] border-2 border-white/30 bg-white shadow-[0_30px_65px_-12px_rgba(0,0,0,0.75)]">
                      {/* Admin-editable image source — plain <img>, same reasoning as products. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={active.image}
                        alt={active.caption || active.label || stageName || ""}
                        className="block h-auto w-full object-contain"
                      />
                    </div>
                    <div
                      ref={shadowRef}
                      className="mx-auto mt-4 h-4 w-48 rounded-full bg-black/60 blur-md"
                    />
                  </div>
                </div>

                {(active.caption || active.label) && (
                  <div className="mt-3 text-center" style={{ transform: "translateZ(15px)" }}>
                    <p className="text-xs font-medium text-brand-cream/85">
                      {active.caption || active.label}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
