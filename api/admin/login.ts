import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminLoginSchema } from "../../shared/schemas.js";
import { createAdminCookie } from "../_lib/auth.js";
import { getServerEnv } from "../_lib/env.js";
import { parseBody, sendJson } from "../_lib/http.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Método não permitido." });
  }

  let body: unknown;
  try {
    body = parseBody(req.body);
  } catch {
    return sendJson(res, 400, { error: "JSON inválido." });
  }
  const parsed = adminLoginSchema.safeParse(body);

  if (!parsed.success) {
    return sendJson(res, 400, { error: "Informe a senha administrativa." });
  }

  const env = getServerEnv();

  if (parsed.data.password !== env.adminPassword) {
    return sendJson(res, 401, { error: "Senha administrativa inválida." });
  }

  res.setHeader("Set-Cookie", createAdminCookie());
  return sendJson(res, 200, { ok: true });
}
