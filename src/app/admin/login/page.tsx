import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/PageTransition";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Admin login",
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const params = await searchParams;
  const redirectTo =
    params.redirect && params.redirect.startsWith("/admin")
      ? params.redirect
      : "/admin";

  return (
    <PageTransition>
      <section className="mx-auto max-w-[1280px] px-5 pt-14 pb-24 sm:px-8 sm:pt-20">
        <div className="mb-10 text-center">
          <p className="text-xs font-medium text-[#9a9a9a]">Owner only</p>
          <h1 className="font-display page-headline mt-2 text-white">
            Admin login
          </h1>
        </div>

        <AdminLoginForm
          supabaseConfigured={isSupabaseConfigured()}
          redirectTo={redirectTo}
          initialError={params.error}
        />
      </section>
    </PageTransition>
  );
}
