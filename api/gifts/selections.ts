import type { VercelRequest, VercelResponse } from "@vercel/node";
import { giftSelectionSchema } from "../../shared/schemas.js";
import { eventSlug } from "../../shared/invite.js";
import { requireGiftListEnabled } from "../_lib/features.js";
import { parseBody, sendJson } from "../_lib/http.js";
import { getSupabaseClient } from "../_lib/supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Método não permitido." });
  }

  if (!requireGiftListEnabled(res)) return;

  let body: unknown;
  try {
    body = parseBody(req.body);
  } catch {
    return sendJson(res, 400, { error: "JSON inválido." });
  }

  const requestBody = typeof body === "object" && body !== null ? body : {};
  const parsed = giftSelectionSchema.safeParse({ ...requestBody, event_slug: eventSlug });
  if (!parsed.success) {
    return sendJson(res, 400, {
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    });
  }

  const supabase = getSupabaseClient();
  const giftIds = parsed.data.items.map((item) => item.gift_item_id);
  const { data: gifts, error: giftsError } = await supabase
    .from("gift_items")
    .select("id, price_cents, name")
    .eq("event_slug", eventSlug)
    .eq("is_active", true)
    .in("id", giftIds);

  if (giftsError || !gifts || gifts.length !== giftIds.length) {
    return sendJson(res, 400, {
      error: "Um ou mais presentes selecionados estão indisponíveis.",
    });
  }

  const totalCents = parsed.data.items.reduce((sum, item) => {
    const gift = gifts.find((candidate) => candidate.id === item.gift_item_id);
    return sum + (gift?.price_cents ?? 0) * item.quantity;
  }, 0);

  const { data: selection, error: selectionError } = await supabase
    .from("gift_selections")
    .insert({
      event_slug: eventSlug,
      guest_name: parsed.data.guest_name,
      guest_phone: parsed.data.guest_phone,
      message: parsed.data.message,
      total_cents: totalCents,
      payment_status: "pending",
      admin_notes: "",
    })
    .select("id")
    .single();

  if (selectionError || !selection) {
    return sendJson(res, 500, { error: "Não foi possível salvar a seleção de presentes." });
  }

  const rows = parsed.data.items.map((item) => {
    const gift = gifts.find((candidate) => candidate.id === item.gift_item_id);
    return {
      selection_id: selection.id,
      gift_item_id: item.gift_item_id,
      quantity: item.quantity,
      unit_price_cents: gift?.price_cents ?? 0,
    };
  });

  const { error: itemsError } = await supabase.from("gift_selection_items").insert(rows);
  if (itemsError) {
    await supabase.from("gift_selections").delete().eq("id", selection.id);
    return sendJson(res, 500, { error: "Não foi possível salvar os itens selecionados." });
  }

  return sendJson(res, 200, { id: selection.id, total_cents: totalCents });
}
