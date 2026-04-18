import type { VercelRequest, VercelResponse } from "@vercel/node";
import { clearAdminCookie } from "../_lib/auth";
import { sendJson } from "../_lib/http";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Método não permitido." });
  }

  res.setHeader("Set-Cookie", clearAdminCookie());
  return sendJson(res, 200, { ok: true });
}
