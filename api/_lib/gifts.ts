import type { AdminGiftSelectionsResponse, GiftSelectionWithItems } from "../../shared/schemas.js";

export function computeGiftSummary(
  items: GiftSelectionWithItems[],
): AdminGiftSelectionsResponse["summary"] {
  return {
    total: items.length,
    pending: items.filter((item) => item.payment_status === "pending").length,
    paid: items.filter((item) => item.payment_status === "paid").length,
    cancelled: items.filter((item) => item.payment_status === "cancelled").length,
    totalPaidCents: items
      .filter((item) => item.payment_status === "paid")
      .reduce((sum, item) => sum + item.total_cents, 0),
  };
}
