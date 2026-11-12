"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AdminNav({
  newEnquiriesCount,
  userEmail,
}: {
  newEnquiriesCount: number;
  userEmail: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
      await fetch("/api/admin/session", { method: "DELETE" });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  const tabs = [
    { href: "/admin", label: "Gallery", exact: true },
    {
      href: "/admin/enquiries",
      label: "Enquiries",
      badge: newEnquiriesCount,
      exact: false,
    },
    { href: "/admin/settings", label: "Settings", exact: false },
  ];

  return (
    <div className="mb-10 border-b border-[#262626] pb-6">
      <div className="text-center">
        <p className="text-xs font-medium text-[#9a9a9a]">Owner only</p>
        <h1 className="font-display page-headline mt-2 text-white">Admin</h1>
        <p className="mt-2 text-xs text-[#9a9a9a]">Signed in as {userEmail}</p>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <nav
          aria-label="Admin navigation"
          className="flex flex-wrap items-center gap-2"
        >
          {tabs.map((tab) => {
            const active = tab.exact
              ? pathname === tab.href
              : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex items-center gap-2 rounded-[8px] border px-4 py-2 text-xs font-medium transition-colors ${
                  active
                    ? "border-[#ff5a14] bg-[#ff5a14] text-white"
                    : "border-[#262626] bg-[#08080a] text-white/85 hover:border-white/30 hover:text-white"
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.badge === "number" && tab.badge > 0 && (
                  <span
                    aria-label={`${tab.badge} new enquiries`}
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      active
                        ? "bg-black/30 text-white"
                        : "bg-[#e8508c] text-white"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#262626] bg-[#08080a] px-3.5 py-2 text-xs font-medium text-[#d4d4d4] transition-colors hover:border-white/30 hover:text-white disabled:opacity-50"
        >
          <LogOut className="h-3.5 w-3.5" />
          {signingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </div>
  );
}
