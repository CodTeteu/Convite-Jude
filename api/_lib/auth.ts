import type { VercelRequest, VercelResponse } from "@vercel/node";
import jwt from "jsonwebtoken";
import { parse, serialize } from "cookie";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_DURATION_SECONDS,
} from "../../shared/constants.js";
import { getServerEnv } from "./env.js";
import { sendJson } from "./http.js";

export function createAdminCookie() {
  const env = getServerEnv();
  const token = jwt.sign({ role: "admin" }, env.adminJwtSecret, {
    expiresIn: ADMIN_SESSION_DURATION_SECONDS,
  });

  return serialize(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_DURATION_SECONDS,
  });
}

export function clearAdminCookie() {
  return serialize(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function requireAdmin(req: VercelRequest, res: VercelResponse) {
  const env = getServerEnv();
  const cookies = parse(req.headers.cookie ?? "");
  const token = cookies[ADMIN_COOKIE_NAME];

  if (!token) {
    sendJson(res, 401, { error: "Sessão administrativa ausente." });
    return null;
  }

  try {
    return jwt.verify(token, env.adminJwtSecret);
  } catch {
    sendJson(res, 401, { error: "Sessão administrativa inválida." });
    return null;
  }
}
