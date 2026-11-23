// Pure helpers for presenting a business name in the header/footer/about card — no data access,
// safe to import from both Server and Client Components.

// "TC Business Payments Consultant" -> "TC" (a leading all-caps word is taken as the initials);
// otherwise the first letter of the first two words.
export function monogram(name) {
  const words = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (/^[A-Z]{2,4}$/.test(words[0])) return words[0].slice(0, 3);
  return words
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

// Splits a longer name over two lines, last word on the second ("TC Business Payments" /
// "Consultant"). Short names stay on one line.
export function splitBrandName(name) {
  const words = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (words.length < 3) return { line1: words.join(" "), line2: "" };
  return { line1: words.slice(0, -1).join(" "), line2: words[words.length - 1] };
}
