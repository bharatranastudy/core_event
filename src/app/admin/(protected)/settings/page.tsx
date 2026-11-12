import { SettingsForm } from "@/components/admin/SettingsForm";
import { getAdminSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getAdminSettings();

  return <SettingsForm initialSettings={settings} />;
}
