/** @type {import('next').NextConfig} */

// Security headers on every response. The Content-Security-Policy is deliberately minimal: it
// blocks framing by other sites, plugins and <base>/form hijacking, but doesn't restrict scripts,
// styles or images, so the theme script, analytics, WhatsApp links and Blob images keep working.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'",
  },
];

const nextConfig = {
  experimental: {
    serverActions: {
      // Matches lib/blob.js's MAX_UPLOAD_BYTES and Vercel's own hard ceiling for
      // Server Action request bodies — Next.js defaults this to 1MB, which silently
      // rejects any upload above that before the action even runs.
      bodySizeLimit: "4.5mb",
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
