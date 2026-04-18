import type { AdminRsvpItem, AdminRsvpSummary } from "@shared/schemas";

export function computeSummary(items: AdminRsvpItem[]): AdminRsvpSummary {
  const attending = items.filter((item) => item.attendance_status === "attending");
  const notAttending = items.filter(
    (item) => item.attendance_status === "not-attending",
  );
  const pending = items.filter((item) => item.attendance_status === "pending");
  const totalPeople = attending.reduce(
    (sum, item) => sum + 1 + item.companions_count,
    0,
  );

  return {
    total: items.length,
    attending: attending.length,
    notAttending: notAttending.length,
    pending: pending.length,
    totalPeople,
  };
}
