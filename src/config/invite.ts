export { defaultSource, eventSlug, inviteConfig } from "@shared/invite";

import { inviteConfig } from "@shared/invite";
import { imagePath } from "./assets";

export const inviteData = {
  ...inviteConfig,
  graduate: {
    firstName: inviteConfig.people.primaryFirstName,
    lastName: inviteConfig.people.primaryFullName
      .replace(inviteConfig.people.primaryFirstName, "")
      .trim(),
    fullName: inviteConfig.people.primaryFullName,
    course: inviteConfig.people.courseOrSubtitle,
    signatureQuote: inviteConfig.people.signatureQuote,
  },
  journey: inviteConfig.story,
  familyGallery: inviteConfig.gallery,
} as const;

export function resolveInviteImage(path: string) {
  return imagePath(path);
}

export function buildWhatsAppMessage(params: {
  name: string;
  attendance: "attending" | "not-attending";
  companionsNames: string[];
  bingoCardsCount?: number;
  selectedEvents?: string;
}) {
  const attendanceStatus =
    params.attendance === "attending"
      ? "Confirmo minha presença."
      : "Infelizmente não poderei comparecer.";

  const eventLabelMap: Record<string, string> = {
    colacao: "Colação de Grau",
    jantar: "Jantar de Celebração",
    both: "Colação de Grau e Jantar de Celebração",
  };

  const eventsSection =
    params.attendance === "attending" && params.selectedEvents && eventLabelMap[params.selectedEvents]
      ? `\nEventos: ${eventLabelMap[params.selectedEvents]}`
      : "";

  const companionsSection =
    params.attendance === "attending" && params.companionsNames.length > 0
      ? `\nAcompanhantes: ${params.companionsNames.join(", ")}`
      : "";

  const bingoSection =
    params.attendance === "attending" && params.bingoCardsCount && params.bingoCardsCount > 0
      ? `\nComprei ${params.bingoCardsCount} cartela(s) do Bingo Especial (R$ ${params.bingoCardsCount * 20},00 pagos via Pix).`
      : "";

  return `Olá! ${attendanceStatus}${eventsSection}${companionsSection}${bingoSection}\n\nConvidado: ${params.name}`;
}

export const calendarEvent = {
  title: inviteConfig.identity.title,
  details: inviteConfig.identity.description,
  location: inviteConfig.event.venue,
  startDateTime: "20260808T223000Z",
  endDateTime: "20260809T050000Z",
};
