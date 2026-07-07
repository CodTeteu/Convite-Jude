import type { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";
import { adminUpdateSchema, type AdminRsvpItem } from "../../shared/schemas.js";
import { eventSlug } from "../../shared/invite.js";
import { requireAdmin } from "../_lib/auth.js";
import { parseBody, sendJson } from "../_lib/http.js";
import { computeSummary } from "../_lib/rsvps.js";
import { getSupabaseClient } from "../_lib/supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "PATCH" && req.method !== "DELETE") {
    res.setHeader("Allow", "GET, PATCH, DELETE");
    return sendJson(res, 405, { error: "Método não permitido." });
  }

  if (!requireAdmin(req, res)) {
    return;
  }

  const supabase = getSupabaseClient();

  if (req.method === "DELETE") {
    let body: unknown;
    try {
      body = parseBody(req.body);
    } catch {
      return sendJson(res, 400, { error: "JSON inválido." });
    }

    const schema = z.object({
      id: z.string().uuid("Registro inválido."),
    });

    const idParsed = schema.safeParse(body);
    if (!idParsed.success) {
      return sendJson(res, 400, {
        error: idParsed.error.issues[0]?.message ?? "Registro inválido.",
      });
    }

    const { error } = await supabase
      .from("rsvp_confirmations")
      .delete()
      .eq("id", idParsed.data.id)
      .eq("event_slug", eventSlug);

    if (error) {
      return sendJson(res, 500, {
        error: "Não foi possível excluir o registro.",
      });
    }

    return sendJson(res, 200, { ok: true });
  }

  if (req.method === "PATCH") {
    let body: unknown;
    try {
      body = parseBody(req.body);
    } catch {
      return sendJson(res, 400, { error: "JSON inválido." });
    }

    const schema = z.object({
      id: z.string().uuid("Registro inválido."),
    });

    const idParsed = schema.safeParse(body);
    if (!idParsed.success) {
      return sendJson(res, 400, {
        error: idParsed.error.issues[0]?.message ?? "Registro inválido.",
      });
    }

    const updateParsed = adminUpdateSchema.safeParse(body);
    if (!updateParsed.success) {
      return sendJson(res, 400, {
        error: updateParsed.error.issues[0]?.message ?? "Dados inválidos.",
      });
    }

    const { error } = await supabase
      .from("rsvp_confirmations")
      .update(updateParsed.data)
      .eq("id", idParsed.data.id)
      .eq("event_slug", eventSlug);

    if (error) {
      return sendJson(res, 500, {
        error: "Não foi possível atualizar o registro agora.",
      });
    }

    return sendJson(res, 200, { ok: true });
  }

  const { data, error } = await supabase
    .from("rsvp_confirmations")
    .select(
      "id, guest_name, phone, attendance_status, companions_count, companions_names, notes, admin_notes, source, event_slug, submitted_at, created_at, updated_at",
    )
    .eq("event_slug", eventSlug)
    .order("created_at", { ascending: false });

  if (error) {
    return sendJson(res, 500, {
      error: "Não foi possível carregar as confirmações do painel.",
    });
  }

  const items = (data ?? []) as AdminRsvpItem[];
  return sendJson(res, 200, {
    items,
    summary: computeSummary(items),
  });
}
