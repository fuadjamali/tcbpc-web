"use client";

import { useId, useState } from "react";
import { normalizeWebsiteUrl } from "@/lib/websiteUrl";
import { PORTFOLIO_SIZES, normalizePortfolioSize } from "@/lib/portfolioDisplay";

const fieldClass =
  "mt-1 w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-foreground placeholder-muted focus:border-accent focus:outline-none";

const SWATCH_PX = { small: 26, medium: 38, large: 52 };

// The three "how does this project appear on the home page" settings: website link, card size,
// and the live-preview switch. Client component so the link can be checked as the admin types
// (same normalizeWebsiteUrl the save action runs) and the switch can explain when it won't apply.
export default function PortfolioDisplayFields({ item }) {
  const [url, setUrl] = useState(item?.website_url ?? "");
  const [size, setSize] = useState(normalizePortfolioSize(item?.image_size));
  const [live, setLive] = useState(Boolean(item?.live_preview));
  const uid = useId();

  const { error } = normalizeWebsiteUrl(url);
  const hasLink = url.trim() !== "" && !error;

  function handleUrlChange(e) {
    const value = e.target.value;
    setUrl(value);
    // Blocks form submit with a native message when the address is invalid.
    e.target.setCustomValidity(normalizeWebsiteUrl(value).error || "");
  }

  // What the saved header check said last time (edit form only) — shown so the admin isn't
  // surprised by a fallback to the image. null/undefined = not checked yet or couldn't tell.
  const lastCheck = item?.live_preview ? item.preview_embeddable : undefined;

  let previewNote = null;
  if (live && !hasLink) {
    previewNote = { tone: "warn", text: "Add a website link first — the preview needs one." };
  } else if (live && size === "small") {
    previewNote = {
      tone: "warn",
      text: "Small is too tiny for a live preview, so the image will be shown. Pick Medium or Large.",
    };
  } else if (live && lastCheck === false) {
    previewNote = {
      tone: "warn",
      text: "Last check: this site tells browsers not to embed it, so visitors see the image instead. It's re-checked each time you save.",
    };
  } else if (live && lastCheck === true) {
    previewNote = { tone: "ok", text: "Last check: this site allows embedding." };
  } else if (live) {
    previewNote = {
      tone: "info",
      text: "When you save, we'll check the site allows embedding. If it doesn't, the image is shown instead.",
    };
  }

  const noteClass = {
    ok: "text-green-700 dark:text-green-400",
    warn: "text-amber-700 dark:text-amber-400",
    info: "text-muted",
  };

  return (
    <>
      <div>
        <label htmlFor={`${uid}-url`} className="block text-sm font-medium text-foreground">
          Website link <span className="font-normal text-muted">(optional)</span>
        </label>
        <div className="relative">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 mt-0.5 h-4 w-4 -translate-y-1/2 text-muted"
          >
            <path d="M8.5 11.5a3.5 3.5 0 005 0l2.5-2.5a3.5 3.5 0 00-5-5L9.8 5.2" />
            <path d="M11.5 8.5a3.5 3.5 0 00-5 0L4 11a3.5 3.5 0 005 5l1.2-1.2" />
          </svg>
          <input
            id={`${uid}-url`}
            type="text"
            name="websiteUrl"
            inputMode="url"
            autoComplete="off"
            value={url}
            onChange={handleUrlChange}
            placeholder="https://www.example.com"
            aria-invalid={Boolean(error)}
            className={fieldClass}
          />
        </div>
        {error ? (
          <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>
        ) : hasLink ? (
          <p className="mt-1.5 text-xs text-green-700 dark:text-green-400">
            ✓ Opens in a new tab when a visitor clicks the image
          </p>
        ) : (
          <p className="mt-1.5 text-xs text-muted">
            Leave empty and the image isn&apos;t clickable. We add https:// for you if you forget it.
          </p>
        )}
      </div>

      <fieldset>
        <legend className="block text-sm font-medium text-foreground">
          Image size on the home page
        </legend>
        <div className="mt-2 grid grid-cols-3 gap-2.5">
          {Object.entries(PORTFOLIO_SIZES).map(([key, option]) => (
            <label key={key} className="cursor-pointer">
              <input
                type="radio"
                name="imageSize"
                value={key}
                checked={size === key}
                onChange={() => setSize(key)}
                className="peer sr-only"
              />
              <span className="block rounded-xl border-[1.5px] border-border bg-surface px-2 pb-2.5 pt-3 text-center transition peer-checked:border-primary peer-checked:bg-surface-alt peer-checked:ring-2 peer-checked:ring-primary/20 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                <span
                  aria-hidden="true"
                  className="mx-auto mb-2 block rounded-md border border-border bg-surface-alt"
                  style={{ width: SWATCH_PX[key], height: SWATCH_PX[key] }}
                />
                <b className="block text-sm text-foreground">{option.label}</b>
                <span className="block text-xs text-muted">{option.hint}</span>
              </span>
            </label>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-muted">
          Large is the original look. Use Small or Medium for logos — they&apos;re shown whole, not
          cropped.
        </p>
      </fieldset>

      <div>
        <span className="block text-sm font-medium text-foreground">Live website preview</span>
        <label className="mt-2 flex cursor-pointer items-center gap-3 text-sm text-foreground">
          <input
            type="checkbox"
            name="livePreview"
            checked={live}
            onChange={(e) => setLive(e.target.checked)}
            role="switch"
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className="relative h-[26px] w-11 shrink-0 rounded-full bg-border transition peer-checked:bg-primary peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent after:absolute after:left-[3px] after:top-[3px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-[18px]"
          />
          <span>
            <b>{live ? "On" : "Off"}</b> —{" "}
            {live ? "visitors see the live site" : "visitors see your image"}
          </span>
        </label>
        {previewNote && (
          <p className={`mt-1.5 text-xs ${noteClass[previewNote.tone]}`}>{previewNote.text}</p>
        )}
        <p className="mt-1.5 text-xs text-muted">
          Shows the real site inside a small browser window; clicking it still opens the site in a
          new tab. Needs a website link, and Medium or Large. If the site can&apos;t be embedded,
          your image is shown instead.
        </p>
      </div>
    </>
  );
}
