"use client";

import { useEffect, useRef } from "react";

// Filters the home page product grid in the browser: cards carry data-product-category, and the
// ones that don't match are hidden. The choice is mirrored into ?category= so old links still
// work, without the page having to read searchParams (which would turn off its ISR cache).
function applyFilter(value) {
  document.querySelectorAll("[data-product-category]").forEach((card) => {
    card.hidden = Boolean(value) && card.dataset.productCategory !== value;
  });
}

export default function CategoryFilter({ categories }) {
  const selectRef = useRef(null);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("category") || "";
    if (fromUrl && categories.includes(fromUrl) && selectRef.current) {
      selectRef.current.value = fromUrl;
      applyFilter(fromUrl);
    }
  }, [categories]);

  function onChange(e) {
    const value = e.target.value;
    applyFilter(value);
    const url = new URL(window.location.href);
    if (value) url.searchParams.set("category", value);
    else url.searchParams.delete("category");
    window.history.replaceState(null, "", url);
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <label htmlFor="category-filter" className="text-sm text-muted">
        Filter by category:
      </label>
      <select
        ref={selectRef}
        id="category-filter"
        defaultValue=""
        onChange={onChange}
        className="rounded-lg border border-border bg-surface px-2 py-1 text-sm text-foreground"
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
