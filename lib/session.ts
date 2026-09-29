import type { Session } from "@supabase/supabase-js";

export function displayName(session: Session): string {
  const fullName = session.user.user_metadata?.full_name;
  if (typeof fullName === "string" && fullName.trim()) return fullName.trim();
  if (session.user.email) return session.user.email;
  if (session.user.phone) return session.user.phone;
  return "Citizen";
}

export function displayContact(session: Session): string {
  return session.user.email ?? session.user.phone ?? "Verified session";
}

export function initials(name: string): string {
  const parts = name.split(/[\s@._-]+/).filter(Boolean);
  if (parts.length === 0) return "SS";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}
