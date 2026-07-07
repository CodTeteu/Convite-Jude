import type { VercelResponse } from "@vercel/node";
import { inviteConfig } from "../../shared/invite.js";
import { sendJson } from "./http.js";

export function requireGiftListEnabled(res: VercelResponse) {
  if (!inviteConfig.features.giftList || !inviteConfig.giftList.enabled) {
    sendJson(res, 404, { error: "Lista de presentes indisponível para este convite." });
    return false;
  }

  return true;
}
