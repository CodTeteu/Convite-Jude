import type { VercelResponse } from "@vercel/node";

export function sendJson(
  res: VercelResponse,
  status: number,
  payload: Record<string, unknown>,
) {
  return res.status(status).json(payload);
}

export function parseBody(body: unknown) {
  if (typeof body === "string") {
    return JSON.parse(body);
  }

  return body;
}
