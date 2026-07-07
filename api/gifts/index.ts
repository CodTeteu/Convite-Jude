import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eventSlug } from "../../shared/invite.js";
import { requireGiftListEnabled } from "../_lib/features.js";
import { sendJson } from "../_lib/http.js";
import { getSupabaseClient } from "../_lib/supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return sendJson(res, 405, { error: "Método não permitido." });
  }

  if (!requireGiftListEnabled(res)) return;

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("gift_items")
    .select("id, name, description, price_cents, category, image_url, is_active, sort_order")
    .eq("event_slug", eventSlug)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    return sendJson(res, 500, { error: "Não foi possível carregar a lista de presentes." });
  }

  return sendJson(res, 200, { items: data ?? [] });
}
