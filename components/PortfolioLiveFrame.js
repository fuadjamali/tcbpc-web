"use client";

import { useEffect, useRef, useState } from "react";

// A real desktop-width page (1280x960) scaled down to fit the card, inside a tiny browser-window
// frame. The embedded page isn't interactive (pointer-events-none) — the card's own link,
// wrapped around this by PortfolioCard, handles the click and opens the site in a new tab.
//
// The site is only loaded once the card scrolls near the viewport, so a portfolio full of
// previews doesn't make every visitor download several websites up front. `sandbox` lets the
// page run its scripts but keeps it from navigating, opening popups, or reaching our page.
const PAGE_W = 1280;
const PAGE_H = 960;

export default function PortfolioLiveFrame({ url, title }) {
  const boxRef = useRef(null);
  const [scale, setScale] = useState(0);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const resize = new ResizeObserver(() => setScale(el.clientWidth / PAGE_W));
    resize.observe(el);
    setScale(el.clientWidth / PAGE_W);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => {
      resize.disconnect();
      io.disconnect();
    };
  }, []);

  let host = url;
  try {
    host = new URL(url).host.replace(/^www\./, "");
  } catch {}

  return (
    <div aria-hidden="true">
      <div className="flex items-center gap-1.5 border-b border-border bg-surface-alt px-2.5 py-1.5">
        <i className="block h-2 w-2 rounded-full bg-red-400" />
        <i className="block h-2 w-2 rounded-full bg-amber-400" />
        <i className="block h-2 w-2 rounded-full bg-emerald-400" />
        <span className="ml-1.5 min-w-0 flex-1 truncate rounded-full bg-surface px-2.5 py-0.5 text-[10.5px] text-muted">
          {host}
        </span>
      </div>
      <div ref={boxRef} className="relative aspect-[4/3] overflow-hidden bg-white">
        {near && scale > 0 && (
          <iframe
            src={url}
            title={`${title} preview`}
            loading="lazy"
            tabIndex={-1}
            sandbox="allow-scripts allow-same-origin"
            referrerPolicy="no-referrer"
            style={{
              width: PAGE_W,
              height: PAGE_H,
              transform: `scale(${scale})`,
              transformOrigin: "0 0",
            }}
            className="pointer-events-none absolute left-0 top-0 border-0"
          />
        )}
      </div>
    </div>
  );
}
