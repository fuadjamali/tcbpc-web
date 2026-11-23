"use client";

import { useState } from "react";

// The flagship card's right-hand "Interactive Preview" panel: photo tabs (one per product photo
// that has a label) swap the image and its caption. Photos come from lib/productPhotos.js, so the
// tab names/captions are edited per photo in the product's photo manager.
export default function FlagshipPreview({ title, photos }) {
  const tabbed = photos.filter((p) => p.label);
  const shown = tabbed.length > 0 ? tabbed : photos.slice(0, 1);
  const [activeId, setActiveId] = useState(shown[0]?.id);
  const active = shown.find((p) => p.id === activeId) || shown[0];
  if (!active) return null;

  return (
    <div className="flex h-full flex-col justify-between bg-brand-deep p-6 text-white sm:p-10">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
          Interactive Preview
        </span>
        <h4 className="mt-1 text-lg font-bold">{title}</h4>

        {shown.length > 1 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {shown.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setActiveId(photo.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  photo.id === active.id
                    ? "bg-brand-teal text-brand-ink"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {photo.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="my-6 flex min-h-[260px] items-center justify-center">
        <div className="w-64 overflow-hidden rounded-[28px] border-4 border-white/30 bg-white shadow-2xl">
          {/* Admin-editable image source — plain <img>, same reasoning as products. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={active.image}
            alt={active.caption || active.label || title}
            className="block h-auto w-full object-contain"
          />
        </div>
      </div>

      {(active.caption || active.label) && (
        <p className="text-center text-xs text-white/80">{active.caption || active.label}</p>
      )}
    </div>
  );
}
