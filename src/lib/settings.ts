import { siteConfig } from "@/config/site";
import { createAdminSupabaseClient, createServerSupabaseClient } from "./supabase/server";
import type { PublicSiteSettings, SiteSettings } from "@/types/database";

export function getDefaultSettings(): SiteSettings {
  return {
    company_name: siteConfig.companyName,
    city_region: siteConfig.cityRegion,
    notification_email:
      process.env.ADMIN_NOTIFICATION_EMAIL?.trim() ||
      process.env.ADMIN_EMAIL?.trim() ||
      siteConfig.contactEmail,
    contact_email: siteConfig.contactEmail,
    contact_phone: siteConfig.contactPhone,
  };
}

export async function getPublicSettings(): Promise<PublicSiteSettings> {
  const defaults = getDefaultSettings();

  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return {
        company_name: defaults.company_name,
        city_region: defaults.city_region,
        contact_email: defaults.contact_email,
        contact_phone: defaults.contact_phone,
      };
    }

    const { data, error } = await supabase
      .from("public_settings")
      .select("company_name, city_region, contact_email, contact_phone")
      .maybeSingle();

    if (error || !data) {
      return {
        company_name: defaults.company_name,
        city_region: defaults.city_region,
        contact_email: defaults.contact_email,
        contact_phone: defaults.contact_phone,
      };
    }

    return {
      company_name: data.company_name || defaults.company_name,
      city_region: data.city_region || defaults.city_region,
      contact_email: data.contact_email || defaults.contact_email,
      contact_phone: data.contact_phone || defaults.contact_phone,
    };
  } catch {
    return {
      company_name: defaults.company_name,
      city_region: defaults.city_region,
      contact_email: defaults.contact_email,
      contact_phone: defaults.contact_phone,
    };
  }
}

export async function getAdminSettings(): Promise<SiteSettings> {
  const defaults = getDefaultSettings();

  try {
    const adminClient = createAdminSupabaseClient();
    const client = adminClient ?? (await createServerSupabaseClient());
    if (!client) {
      return defaults;
    }

    const { data, error } = await client
      .from("settings")
      .select(
        "company_name, city_region, notification_email, contact_email, contact_phone, updated_at"
      )
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) {
      return defaults;
    }

    return {
      company_name: data.company_name || defaults.company_name,
      city_region: data.city_region || defaults.city_region,
      notification_email: data.notification_email || defaults.notification_email,
      contact_email: data.contact_email || defaults.contact_email,
      contact_phone: data.contact_phone || defaults.contact_phone,
      updated_at: data.updated_at,
    };
  } catch {
    return defaults;
  }
}
