import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../shared/database.js";
import { getServerEnv } from "./env.js";

let client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseClient() {
  if (!client) {
    const env = getServerEnv();
    client = createClient<Database>(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return client;
}
