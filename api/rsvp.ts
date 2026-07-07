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

    // Check if an RSVP with same guest_name and phone already exists for this event_slug
    const { data: existing } = await supabase
      .from("rsvp_confirmations")
      .select("id, admin_notes")
      .eq("phone", submission.phone)
      .eq("guest_name", submission.guest_name)
      .eq("event_slug", eventSlug)
      .maybeSingle();

    let resultData: { id: string; submitted_at: string } | null = null;

    if (existing) {
      // Update existing RSVP, preserving existing admin_notes
      const { data, error } = await supabase
        .from("rsvp_confirmations")
        .update({
          attendance_status: submission.attendance_status,
          companions_count: submission.companions_count,
          companions_names: submission.companions_names,
          notes: submission.notes,
          acknowledged_guidelines: submission.acknowledged_guidelines,
          source: submission.source,
          submitted_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select("id, submitted_at")
        .single();

      if (error || !data) {
        return sendJson(res, 500, {
          error: "Não foi possível atualizar sua confirmação no momento.",
        });
      }
      resultData = data;
    } else {
      // Insert new RSVP
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
      resultData = data;
    }

    return sendJson(res, 200, resultData);
  } catch (error) {
    return sendJson(res, 500, {
      error:
        error instanceof Error
          ? error.message
          : "Falha inesperada ao processar o RSVP.",
    });
  }
}
