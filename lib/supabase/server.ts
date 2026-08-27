import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null | undefined;

/**
 * Server-only Supabase client using the service role key. Returns null when
 * env vars aren't configured, so persistence is best-effort in v1 — routes
 * that call this must handle a null client gracefully rather than failing
 * the request.
 */
export function getSupabaseServer(): SupabaseClient | null {
  if (client !== undefined) return client;

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    client = null;
    return client;
  }

  client = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
  return client;
}
