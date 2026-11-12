"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AdminLoginForm({
  supabaseConfigured,
  redirectTo = "/admin",
  initialError,
}: {
  supabaseConfigured: boolean;
  redirectTo?: string;
  initialError?: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    initialError === "unauthorized"
      ? "This account is not authorized to access the admin area."
      : null
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const supabase = createClient();
    if (!supabase) {
      setError(
        "Supabase is not configured yet. Add your Supabase keys to .env.local first."
      );
      return;
    }

    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      const verifyRes = await fetch("/api/admin/session", {
        method: "POST",
      });

      if (!verifyRes.ok) {
        const data = (await verifyRes.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(
          data.error || "This account is not authorized for admin access."
        );
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Could not sign in right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-[460px] rounded-[12px] border border-[#262626] bg-[#08080a] p-6 sm:p-8">
      {!supabaseConfigured && (
        <div
          role="status"
          className="mb-6 rounded-[8px] border border-[#ff5a14]/50 bg-[#ff5a14]/10 p-4 text-xs leading-relaxed text-white/90"
        >
          Supabase environment variables are not configured yet. Follow the
          README to add{" "}
          <code className="text-[#ff5a14]">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
          <code className="text-[#ff5a14]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>,
          and <code className="text-[#ff5a14]">ADMIN_EMAIL</code> in{" "}
          <code>.env.local</code>.
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-[8px] border border-[#ff5a14]/60 bg-[#ff5a14]/10 p-3.5 text-xs text-white"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#ff5a14]" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="admin-email"
            className="mb-1.5 block text-xs font-medium text-[#d4d4d4]"
          >
            Admin email
          </label>
          <input
            id="admin-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="owner@yourcompany.com"
            className="w-full rounded-[8px] border border-[#262626] bg-black px-3.5 py-2.5 text-sm text-white placeholder-[#666] focus:border-[#0a6cf0]"
          />
        </div>

        <div>
          <label
            htmlFor="admin-password"
            className="mb-1.5 block text-xs font-medium text-[#d4d4d4]"
          >
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-[8px] border border-[#262626] bg-black px-3.5 py-2.5 text-sm text-white placeholder-[#666] focus:border-[#0a6cf0]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-[8px] border border-[#ff5a14] bg-[#ff5a14] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#e54b09] disabled:opacity-60"
        >
          <Lock className="h-4 w-4" />
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
