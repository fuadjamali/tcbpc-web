"use client";

import { useEffect, useRef, useState } from "react";

const INTERVAL_MS = 3000;

// A photo whose file lives under an `/cutout/` path is a background-removed product shot
// (transparent PNG/WebP): it gets the free-floating treatment — rim light, studio shadow, gloss
// sweep, reflection — and pops out over the card. Any other photo (a normal rectangular shot) is
// shown in a rounded white frame instead, so an admin uploading an ordinary photo still looks right.
export function isCutout(photo) {
  return /\/cutout\//.test(photo?.image || "");
}

// The lively product stage used by the split hero and the flagship card's preview panel: the
// product's photos (lib/productPhotos.js) cycle every 3 seconds with a 3D swing, float gently and
// tilt with scroll/mouse. Labelled photos become chips that jump to that photo; small bars show
// the timing. Hover pauses the cycle; visitors who prefer reduced motion get a still stage.
// `size` sets the device's box height in px (desktop); it scales down on phones. `priority` (the
// hero) makes the browser fetch the first photo straight away, since it is the page's main image;
// the other photos load lazily.
export default function ProductStage({ photos, size = 380, chipsClassName = "", priority = false, children }) {
  const [{ index, previous }, setSlide] = useState({ index: 0, previous: null });
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const stageRef = useRef(null);
  const tiltRef = useRef(null);
  const floorRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const count = photos.length;
  const labelled = photos.some((p) => p.label);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (count < 2 || paused || reduced) return undefined;
    const id = setInterval(() => {
      setSlide((s) => ({ previous: s.index, index: (s.index + 1) % count }));
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [count, paused, reduced]);

  // scroll + mouse tilt
  useEffect(() => {
    const stage = stageRef.current;
    const tilt = tiltRef.current;
    if (!stage || !tilt || reduced) return undefined;
    function update() {
      const r = stage.getBoundingClientRect();
      const h = window.innerHeight || 800;
      const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - h / 2) / (h * 0.75)));
      const ry = p * -12 + mouse.current.x * 14;
      const rx = p * 6 - mouse.current.y * 8;
      tilt.style.transform = `translate3d(0, ${(p * -12).toFixed(1)}px, 0) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg)`;
      if (floorRef.current) {
        floorRef.current.style.transform = `translateX(${(-ry * 1.4).toFixed(1)}px) scale(${(1 - Math.abs(p) * 0.12).toFixed(2)})`;
      }
    }
    function onMove(e) {
      const r = stage.getBoundingClientRect();
      mouse.current = { x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * 2 };
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
  }, [reduced]);

  if (count === 0) return null;

  function goTo(i) {
    setSlide((s) => (s.index === i ? s : { previous: s.index, index: i }));
  }
  const active = photos[index];
  // Only the true hero stage (priority=true) gets its first photo fetched eagerly/with priority;
  // every other photo — including the first one in a non-priority stage, e.g. the flagship card's
  // own "Interactive Preview" panel further down the page — is lazy, so it isn't auto-preloaded
  // and doesn't compete with the real hero image for bandwidth on a slow connection.
  const imgLoading = (i) =>
    i === 0 && priority ? { fetchPriority: "high" } : { loading: "lazy" };

  return (
    <div
      ref={stageRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <style>{`
        /* Slide change: the outgoing photo turns away and slips left, blurred, and is gone before the
           incoming one turns in from the right (short delay) — no double-exposure crossfade. */
        .ps-shot { position:absolute; inset:0; display:flex; align-items:flex-end; justify-content:center;
          pointer-events:none; transform-origin:50% 70%;
          opacity:0; transform:translateX(16%) rotateY(-24deg) scale(.92); filter:blur(6px);
          transition:opacity .5s ease .18s, transform 1s cubic-bezier(.16,1,.3,1) .18s, filter .55s ease .18s; }
        .ps-shot.ps-on { opacity:1; transform:none; filter:none; }
        .ps-shot.ps-out { opacity:0; transform:translateX(-16%) rotateY(24deg) scale(.92); filter:blur(6px);
          transition:opacity .28s ease, transform .5s cubic-bezier(.7,0,.84,0), filter .28s ease; }
        /* the frame hugs the image exactly, so the light sweep's silhouette mask lines up with it */
        .ps-frame { position:relative; display:inline-block; line-height:0; }
        .ps-cut { display:block; width:auto; height:auto; max-height:var(--ps-h); max-width:min(100%, calc(var(--ps-h) * 1.3));
          filter:drop-shadow(0 0 1px rgba(60,234,199,.5)) drop-shadow(0 2px 2px rgba(0,0,0,.35)) drop-shadow(0 30px 26px rgba(0,0,0,.5));
          -webkit-box-reflect:below 2px linear-gradient(transparent 80%, rgba(255,255,255,.12)); }
        /* "flash" light sweep: one soft, narrow highlight glides across the product once it has landed */
        .ps-sheen { position:absolute; inset:0; pointer-events:none; mix-blend-mode:screen; opacity:0;
          background:linear-gradient(115deg, transparent 38%, rgba(255,255,255,.08) 44%, rgba(255,255,255,.7) 50%,
            rgba(200,255,240,.28) 53%, transparent 60%);
          background-size:320% 100%; background-repeat:no-repeat; background-position:140% 0;
          -webkit-mask-size:100% 100%; mask-size:100% 100%; -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; }
        .ps-on .ps-sheen { animation:ps-sweep 1.15s cubic-bezier(.45,0,.2,1) .7s both; }
        @keyframes ps-sweep { 0% { background-position:140% 0; opacity:0 } 12%,80% { opacity:1 }
          100% { background-position:-40% 0; opacity:0 } }
        /* soft glow that blooms behind the product as each photo arrives */
        .ps-flare { position:absolute; left:50%; bottom:18%; width:78%; max-width:320px; aspect-ratio:1; pointer-events:none;
          transform:translateX(-50%) scale(.6); opacity:0; border-radius:9999px;
          background:radial-gradient(circle, rgba(255,255,255,.35) 0%, rgba(60,234,199,.22) 32%, transparent 66%);
          animation:ps-flare 1.1s ease-out .25s both; }
        @keyframes ps-flare { 0% { opacity:0; transform:translateX(-50%) scale(.6) } 35% { opacity:.9 }
          100% { opacity:0; transform:translateX(-50%) scale(1.25) } }
        @keyframes ps-float { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-10px) } }
        .ps-float { animation:ps-float 4.5s ease-in-out infinite; }
        @keyframes ps-fill { from { width:0 } to { width:100% } }
        @media (prefers-reduced-motion: reduce) { .ps-float, .ps-on .ps-sheen, .ps-flare { animation:none } .ps-shot, .ps-shot.ps-out { transition:opacity .3s; filter:none; transform:none } }
      `}</style>

      <div className="relative" style={{ perspective: "1400px" }}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 left-1/2 h-[90%] w-[90%] max-w-[360px] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(241,241,236,.2) 0%, rgba(60,234,199,.10) 35%, transparent 68%)",
          }}
        />
        <div
          className="relative mx-auto h-[var(--ps-h)] w-full"
          style={{ "--ps-h": `clamp(240px, 88vw, ${size}px)` }}
        >
          {count > 1 && <div key={index} aria-hidden="true" className="ps-flare" />}
          <div ref={tiltRef} className="absolute inset-0 will-change-transform" style={{ transformStyle: "preserve-3d" }}>
            <div className="ps-float absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
              {photos.map((photo, i) => (
                <div
                  key={photo.id}
                  className={`ps-shot ${i === index ? "ps-on" : ""} ${i === previous && i !== index ? "ps-out" : ""}`}
                  aria-hidden={i !== index}
                >
                  {isCutout(photo) ? (
                    <span className="ps-frame">
                      {/* Admin-editable image source — plain <img>, same reasoning as products. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.image} alt={photo.caption || photo.label || ""} className="ps-cut" {...imgLoading(i)} />
                      <span
                        aria-hidden="true"
                        className="ps-sheen"
                        style={{ WebkitMaskImage: `url(${photo.image})`, maskImage: `url(${photo.image})` }}
                      />
                    </span>
                  ) : (
                    <span className="mb-4 block w-[72%] max-w-[300px] overflow-hidden rounded-[28px] border-2 border-white/30 bg-white shadow-[0_30px_65px_-12px_rgba(0,0,0,0.75)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.image} alt={photo.caption || photo.label || ""} className="block h-auto w-full" {...imgLoading(i)} />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          {children}
        </div>
        <div ref={floorRef} aria-hidden="true" className="mx-auto -mt-1 h-3 w-44 rounded-full bg-black/55 blur-md" />
      </div>

      {(labelled || count > 1) && (
        <div className={`mt-5 hidden flex-col items-center gap-3 sm:flex ${chipsClassName}`}>
          {labelled && (
            <div className="inline-flex flex-wrap justify-center rounded-full border border-white/10 bg-brand-ink/50 p-1" role="group" aria-label="Choose a photo">
              {photos.map((photo, i) =>
                photo.label ? (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-pressed={i === index}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      i === index ? "bg-brand-teal text-brand-ink" : "text-white/80 hover:text-white"
                    }`}
                  >
                    {photo.label}
                  </button>
                ) : null
              )}
            </div>
          )}
          {count > 1 && (
            <div className="flex w-44 gap-1.5" aria-hidden="true">
              {photos.map((photo, i) => (
                <span key={photo.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
                  <span
                    key={`${i}-${index}-${paused}`}
                    className="block h-full rounded-full bg-brand-teal"
                    style={{
                      width: i < index ? "100%" : i > index ? "0%" : paused || reduced ? "100%" : undefined,
                      animationName: i === index && !paused && !reduced ? "ps-fill" : undefined,
                      animationDuration: `${INTERVAL_MS}ms`,
                      animationTimingFunction: "linear",
                      animationFillMode: "forwards",
                    }}
                  />
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {(active?.caption || active?.label) && (
        <p className="mt-3 hidden text-center text-xs font-medium text-brand-cream/85 sm:block">
          {active.caption || active.label}
        </p>
      )}
    </div>
  );
}
