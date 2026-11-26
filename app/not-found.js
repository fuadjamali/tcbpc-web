import Link from "next/link";
import Logo from "@/components/Logo";

// Shown with a real 404 status for any public address that doesn't exist. proxy.js rewrites
// unknown public paths here (unknown /admin and /api paths still get the 401 "Site Unavailable").
export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-alt px-6">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 text-center shadow-sm">
        <Logo className="mx-auto h-10 w-10 text-muted" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">Error 404</p>
        <h1 className="mt-1 text-xl font-bold text-foreground">Page not found</h1>
        <p className="mt-2 text-sm text-muted">
          This page doesn&apos;t exist or has moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
