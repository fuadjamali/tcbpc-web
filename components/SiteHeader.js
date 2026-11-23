"use client";

import { useState } from "react";
import { IconChevronDown, IconMenu2, IconUserCircle } from "@tabler/icons-react";
import Logo from "@/components/Logo";
import { useLogoUrl } from "@/components/LogoContext";
import ThemeToggle from "@/components/ThemeToggle";
import ColorThemeSwitcher from "@/components/ColorThemeSwitcher";
import CartIcon from "@/components/CartIcon";
import SiteNavDropdown from "@/components/SiteNavDropdown";
import { monogram, splitBrandName } from "@/lib/brand";

// Sticky brand-coloured header (bg-brand-deep, see app/globals.css): a monogram badge (or the
// uploaded logo) beside a two-line business name, the admin-managed nav (lib/navItems.js, with
// its CTA item rendered as the teal pill), and a drawer menu below `lg`.
export default function SiteHeader({
  nav,
  businessName,
  cartEnabled = true,
  membersEnabled = true,
  themesEnabled = true,
  footerEnabled = true,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileGroupOpen, setMobileGroupOpen] = useState(null);
  const logoUrl = useLogoUrl();
  const navItems = nav || [];
  const hasNavCta = navItems.some((item) => item.cta);
  const { line1, line2 } = splitBrandName(businessName);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-brand-deep/95 text-white backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group flex shrink-0 cursor-pointer items-center gap-3 text-left"
        >
          {logoUrl ? (
            <Logo className="h-10 w-10 text-white" />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-teal text-lg font-extrabold text-brand-ink shadow-md transition-transform group-hover:scale-105">
              {monogram(businessName)}
            </span>
          )}
          <span>
            <span className="block text-base font-bold leading-tight tracking-tight sm:text-lg">
              {line1}
            </span>
            {line2 && (
              <span className="block text-[11px] font-semibold uppercase tracking-widest text-brand-teal">
                {line2}
              </span>
            )}
          </span>
        </button>

        <div className="hidden items-center gap-7 text-sm font-medium text-white/90 lg:flex">
          {navItems.map((item) =>
            item.children ? (
              <SiteNavDropdown key={item.label} label={item.label} items={item.children} />
            ) : item.cta ? (
              <a
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-xl bg-brand-teal px-5 py-3 text-sm font-bold text-brand-ink shadow-lg shadow-brand-teal/20 transition hover:bg-brand-teal-hover active:scale-95"
              >
                {item.label}
              </a>
            ) : item.highlight ? (
              <a
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-full border border-brand-teal px-4 py-1.5 text-brand-teal hover:bg-brand-teal hover:text-brand-ink"
              >
                {item.label}
              </a>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="whitespace-nowrap py-2 transition-colors hover:text-brand-teal"
              >
                {item.label}
              </a>
            )
          )}
        </div>

        <div className="flex items-center gap-3">
          {cartEnabled && <CartIcon />}
          {themesEnabled && <ColorThemeSwitcher className="hidden sm:inline-block" />}
          <ThemeToggle className="hidden !border-white/25 !text-white hover:!bg-white/10 sm:inline-flex" />
          {membersEnabled && (
            <a
              href="/member/login"
              className="hidden items-center gap-1.5 whitespace-nowrap rounded-full border border-white/25 px-4 py-2 text-sm font-medium hover:bg-white/10 lg:inline-flex"
            >
              <IconUserCircle size={16} />
              Member Login
            </a>
          )}
          {footerEnabled && !hasNavCta && (
            <a
              href="#contact"
              className="hidden whitespace-nowrap rounded-xl bg-brand-teal px-5 py-3 text-sm font-bold text-brand-ink hover:bg-brand-teal-hover lg:inline-block"
            >
              Get in touch
            </a>
          )}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            className="rounded-xl bg-white/10 p-2.5 text-white hover:bg-white/20 lg:hidden"
          >
            <IconMenu2 size={20} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-white/10 bg-brand-deep lg:hidden">
          <div className="flex flex-col gap-1 px-4 py-4 text-base font-medium">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() =>
                      setMobileGroupOpen((current) => (current === item.label ? null : item.label))
                    }
                    aria-expanded={mobileGroupOpen === item.label}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left hover:bg-white/10"
                  >
                    {item.label}
                    <IconChevronDown
                      size={16}
                      className={`transition-transform ${mobileGroupOpen === item.label ? "rotate-180" : ""}`}
                    />
                  </button>
                  {mobileGroupOpen === item.label && (
                    <div className="ml-3 flex flex-col gap-1 border-l border-white/15 pl-3">
                      {item.children.map((child) => (
                        <a
                          key={child.href}
                          href={child.href}
                          onClick={() => setMenuOpen(false)}
                          className="rounded-xl px-4 py-2.5 text-white/80 hover:bg-white/10 hover:text-white"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={
                    item.cta
                      ? "mt-2 rounded-xl bg-brand-teal px-4 py-3 text-center font-bold text-brand-ink"
                      : item.highlight
                        ? "rounded-xl border border-brand-teal px-4 py-3 font-semibold text-brand-teal"
                        : "rounded-xl px-4 py-3 hover:bg-white/10"
                  }
                >
                  {item.label}
                </a>
              )
            )}
            {membersEnabled && (
              <a
                href="/member/login"
                onClick={() => setMenuOpen(false)}
                className="mt-2 flex items-center gap-1.5 rounded-xl border border-white/25 px-4 py-3 font-medium hover:bg-white/10"
              >
                <IconUserCircle size={16} />
                Member Login
              </a>
            )}

            <div className="mt-2 flex items-center gap-2 sm:hidden">
              {themesEnabled && <ColorThemeSwitcher />}
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
