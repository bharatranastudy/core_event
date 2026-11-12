export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return Boolean(
    url &&
      anonKey &&
      url.startsWith("https://") &&
      !url.includes("your-project-ref") &&
      !anonKey.includes("your-supabase")
  );
}

export function isSupabaseAdminConfigured(): boolean {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return (
    isSupabaseConfigured() &&
    Boolean(serviceKey && !serviceKey.includes("your-supabase"))
  );
}
