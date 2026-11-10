import { lookup } from "node:dns/promises";
import net from "node:net";

function isPrivateAddress(address) {
  if (net.isIPv4(address)) {
    const [a, b] = address.split(".").map(Number);
    return (
      a === 10 ||
      a === 127 ||
      a === 0 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168)
    );
  }
  const v6 = address.toLowerCase();
  return v6 === "::1" || v6 === "::" || v6.startsWith("fc") || v6.startsWith("fd") || v6.startsWith("fe80");
}

// Looks at the site's response headers once, at save time, to learn whether browsers will allow
// it inside an <iframe> on another site. Result is stored on the portfolio row so the public home
// page never makes a network call. Returns true / false, or null when it couldn't be determined
// (site unreachable, slow, or refused our request) — callers treat null as "don't embed".
//
// Blocked when the site sends X-Frame-Options (DENY/SAMEORIGIN/ALLOW-FROM) or a CSP
// frame-ancestors that doesn't allow everyone ('*'). Only admins can reach this (it's called from
// the portfolio save action), and private/loopback hosts are refused so it can't be pointed at
// internal services.
export async function checkEmbeddable(url) {
  try {
    const { hostname } = new URL(url);
    if (hostname === "localhost" || hostname.endsWith(".localhost")) return null;
    const addresses = net.isIP(hostname) ? [{ address: hostname }] : await lookup(hostname, { all: true });
    if (addresses.length === 0 || addresses.some((a) => isPrivateAddress(a.address))) return null;

    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(6000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; EmbedCheck/1.0)", Accept: "text/html" },
    });
    // Only the headers matter — don't download the page body.
    res.body?.cancel().catch(() => {});

    const xfo = res.headers.get("x-frame-options");
    if (xfo) return false;

    const csp = res.headers.get("content-security-policy") || "";
    const ancestors = csp
      .split(";")
      .map((d) => d.trim())
      .find((d) => d.toLowerCase().startsWith("frame-ancestors"));
    if (ancestors) {
      const sources = ancestors.split(/\s+/).slice(1);
      return sources.includes("*");
    }
    return res.ok ? true : null;
  } catch {
    return null;
  }
}
