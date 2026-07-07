export const DEFAULT_EVENT_SLUG = "joana-psicologia";
export const EVENT_SLUG = DEFAULT_EVENT_SLUG;
export const ADMIN_COOKIE_NAME = "convite_admin_session";
export const ADMIN_SESSION_DURATION_SECONDS = 60 * 60 * 12;

export const attendanceStatuses = ["pending", "attending", "not-attending"] as const;

export type AttendanceStatus = (typeof attendanceStatuses)[number];

export const attendanceLabels: Record<AttendanceStatus, string> = {
  pending: "Pendente",
  attending: "Confirmado",
  "not-attending": "Não irá",
};

export const paymentStatuses = ["pending", "paid", "cancelled"] as const;

export type PaymentStatus = (typeof paymentStatuses)[number];

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: "Pendente",
  paid: "Pago",
  cancelled: "Cancelado",
};

export function getExportFilename(prefix: string, eventSlug = DEFAULT_EVENT_SLUG) {
  const today = new Date().toISOString().slice(0, 10);
  return `${prefix}-${eventSlug}-${today}.csv`;
}
