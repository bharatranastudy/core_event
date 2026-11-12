export function isAllowedAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const allowedRaw = process.env.ADMIN_EMAIL?.trim();
  if (!allowedRaw) {
    return false;
  }
  const allowedList = allowedRaw
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
  return allowedList.includes(email.trim().toLowerCase());
}
