import type { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";
import { adminGiftSelectionUpdateSchema } from "../../../shared/schemas.js";
import { requireAdmin } from "../../_lib/auth.js";
import { requireGiftListEnabled } from "../../_lib/features.js";
import { parseBody, sendJson } from "../../_lib/http.js";
import { getSupabaseClient } from "../../_lib/supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "PATCH") {
    res.setHeader("Allow", "PATCH");
    return sendJson(res, 405, { error: "Método não permitido." });
  }

  if (!requireAdmin(req, res)) return;
  if (!requireGiftListEnabled(res)) return;

  let body: unknown;
  try {
    body = parseBody(req.body);
  } catch {
    return sendJson(res, 400, { error: "JSON inválido." });
  }

  const idParsed = z.object({ id: z.string().uuid("Seleção inválida.") }).safeParse(body);
  if (!idParsed.success) {
    return sendJson(res, 400, {
      error: idParsed.error.issues[0]?.message ?? "Seleção inválida.",
    });
  }

  const updateParsed = adminGiftSelectionUpdateSchema.safeParse(body);
  if (!updateParsed.success) {
    return sendJson(res, 400, {
      error: updateParsed.error.issues[0]?.message ?? "Dados inválidos.",
    });
  }

  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("gift_selections")
    .update(updateParsed.data)
    .eq("id", idParsed.data.id);

  if (error) {
    return sendJson(res, 500, { error: "Não foi possível atualizar a seleção." });
  }

  return sendJson(res, 200, { ok: true });
}
