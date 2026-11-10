// Pure (no Node-only imports) so the admin form can run the exact same check in the browser as
// the server action does on save.
function isIpLiteral(hostname) {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname) || hostname.startsWith("[");
}

const MAX_URL_LENGTH = 500;

// Turns what an admin typed into a safe, absolute http(s) URL — or explains why it can't.
// "example.com" becomes "https://example.com/". Anything that isn't plain http/https (javascript:,
// data:, mailto:, ...), has embedded credentials, or has no real hostname is rejected, so a bad
// value can never be stored and later rendered as a link on the public site.
// Returns { url } on success ("" url = no link), or { error } with an admin-readable message.
export function normalizeWebsiteUrl(input) {
  const raw = (input ?? "").toString().trim();
  if (!raw) return { url: "" };
  if (/\s/.test(raw)) return { error: "A website address can't contain spaces." };

  // No scheme typed -> assume https. A scheme-looking prefix that isn't http(s) is rejected
  // below rather than being "fixed" into something else.
  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) || /^(javascript|data|mailto|tel|file|vbscript):/i.test(raw);
  let parsed;
  try {
    parsed = new URL(hasScheme ? raw : `https://${raw}`);
  } catch {
    return { error: "That doesn't look like a website address (try https://www.example.com)." };
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { error: "Only http:// or https:// website addresses are allowed." };
  }
  if (parsed.username || parsed.password) {
    return { error: "Remove the username/password from the address." };
  }
  if (!parsed.hostname.includes(".") && !isIpLiteral(parsed.hostname)) {
    return { error: "That doesn't look like a website address (try https://www.example.com)." };
  }
  if (parsed.href.length > MAX_URL_LENGTH) {
    return { error: "That address is too long." };
  }
  return { url: parsed.href };
}
