import type { VercelRequest, VercelResponse } from "@vercel/node";
import { rsvpSchema } from "../shared/schemas.js";
import { eventSlug } from "../shared/invite.js";
import { parseBody, sendJson } from "./_lib/http.js";
import { getSupabaseClient } from "./_lib/supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Método não permitido." });
  }

  try {
    let body: unknown;
    try {
      body = parseBody(req.body);
    } catch {
      return sendJson(res, 400, { error: "JSON inválido." });
    }
    const parsed = rsvpSchema.safeParse(body);

    if (!parsed.success) {
      return sendJson(res, 400, {
        error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
      });
    }

    const supabase = getSupabaseClient();
    const submission = parsed.data;
    const { data, error } = await supabase
      .from("rsvp_confirmations")
      .insert({
        guest_name: submission.guest_name,
        phone: submission.phone,
        attendance_status: submission.attendance_status,
        companions_count: submission.companions_count,
        companions_names: submission.companions_names,
        notes: submission.notes,
        admin_notes: "",
        acknowledged_guidelines: submission.acknowledged_guidelines,
        source: submission.source,
        event_slug: eventSlug,
        submitted_at: new Date().toISOString(),
      })
      .select("id, submitted_at")
      .single();

    if (error || !data) {
      return sendJson(res, 500, {
        error: "Não foi possível registrar sua confirmação no momento.",
      });
    }

    return sendJson(res, 200, data);
  } catch (error) {
    return sendJson(res, 500, {
      error:
        error instanceof Error
          ? error.message
          : "Falha inesperada ao processar o RSVP.",
    });
  }
}
