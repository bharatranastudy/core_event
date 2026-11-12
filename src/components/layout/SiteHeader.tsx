"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandWordmark } from "./BrandWordmark";

const NAV_LINKS = [
  { href: "/what-we-do", label: "What we do" },
  { href: "/gallery", label: "Gallery" },
  { href: "/enquiry", label: "Enquiry" },
];

export function SiteHeader({ companyName }: { companyName: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-[#262626]/70 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-[1280px] items-center justify-between px-5 sm:px-8">
        <BrandWordmark companyName={companyName} />

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-8 md:flex"
        >
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative py-1.5 text-[13px] font-medium transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-[2px] bg-[#ff5a14]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/enquiry"
            className="hidden rounded-[8px] border border-[#ff5a14] bg-[#ff5a14] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#e54b09] sm:inline-flex"
          >
            Plan my event
          </Link>

          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-[#262626] text-white transition-colors hover:border-[#0a6cf0] md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-[#262626] bg-black px-5 py-5 md:hidden"
        >
          <div className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center justify-between rounded-[8px] border px-4 py-3 text-sm font-medium ${
                    isActive
                      ? "border-[#ff5a14] text-white"
                      : "border-[#262626] text-white/85 hover:border-white/30"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="h-2 w-2 rounded-full bg-[#ff5a14]" />
                  )}
                </Link>
              );
            })}
            <Link
              href="/enquiry"
              className="mt-1 inline-flex items-center justify-center rounded-[8px] border border-[#ff5a14] bg-[#ff5a14] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#e54b09]"
            >
              Plan my event
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
