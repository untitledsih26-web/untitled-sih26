import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const FALLBACK_SUPABASE_URL = "https://ciwhmfbpydwqfjmphzfc.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY = "sb_publishable_CWdbGlLgthJSW";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

function createSupabaseClient(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch {
    return null;
  }
}

export const supabase = createSupabaseClient();
