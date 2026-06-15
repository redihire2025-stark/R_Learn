import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://rdnhbreuusnfvwmrecor.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkbmhicmV1dXNuZnZ3bXJlY29yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3OTg1ODIsImV4cCI6MjA5NTM3NDU4Mn0.eVSHIHpyNUhfYOlBdoDRGTXefkRPm_YCUsmRjz4sl_o";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const ALLOWED_DOMAIN = "redihire.com";

export function isAllowedEmail(email: string): boolean {
  return email.trim().toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`);
}
