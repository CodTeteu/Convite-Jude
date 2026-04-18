export const EVENT_SLUG = "camilla-2026";
export const ADMIN_COOKIE_NAME = "camilla_admin_session";
export const ADMIN_SESSION_DURATION_SECONDS = 60 * 60 * 12;

export const attendanceStatuses = ["pending", "attending", "not-attending"] as const;

export type AttendanceStatus = (typeof attendanceStatuses)[number];

export const attendanceLabels: Record<AttendanceStatus, string> = {
  pending: "Pendente",
  attending: "Confirmado",
  "not-attending": "Não irá",
};
