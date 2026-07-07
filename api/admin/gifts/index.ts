import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { GiftSelectionWithItems } from "../../../shared/schemas.js";
import { eventSlug } from "../../../shared/invite.js";
import { requireAdmin } from "../../_lib/auth.js";
import { requireGiftListEnabled } from "../../_lib/features.js";
import { computeGiftSummary } from "../../_lib/gifts.js";
import { sendJson } from "../../_lib/http.js";
import { getSupabaseClient } from "../../_lib/supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return sendJson(res, 405, { error: "Método não permitido." });
  }

  if (!requireAdmin(req, res)) return;
  if (!requireGiftListEnabled(res)) return;

  const supabase = getSupabaseClient();
  const { data: selections, error } = await supabase
    .from("gift_selections")
    .select("id, guest_name, guest_phone, message, total_cents, payment_status, admin_notes, created_at, updated_at")
    .eq("event_slug", eventSlug)
    .order("created_at", { ascending: false });

  if (error) {
    return sendJson(res, 500, { error: "Não foi possível carregar presentes no admin." });
  }

  const items = (selections ?? []).map((selection) => ({
    ...selection,
    items: [],
  })) as GiftSelectionWithItems[];

  return sendJson(res, 200, { items, summary: computeGiftSummary(items) });
}
