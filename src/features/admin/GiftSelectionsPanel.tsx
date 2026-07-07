import { useEffect, useState } from "react";
import { toast } from "sonner";
import { paymentStatusLabels, type PaymentStatus } from "@shared/constants";
import type { GiftSelectionWithItems } from "@shared/schemas";
import { fetchAdminGiftSelections, updateAdminGiftSelection } from "@/lib/api";
import { formatCurrencyFromCents, formatDisplayDateTime } from "@/lib/format";

export function GiftSelectionsPanel() {
  const [items, setItems] = useState<GiftSelectionWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const response = await fetchAdminGiftSelections();
      setItems(response.items);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível carregar presentes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeout);
  }, []);

  async function updateStatus(id: string, paymentStatus: PaymentStatus) {
    try {
      await updateAdminGiftSelection(id, { payment_status: paymentStatus });
      toast.success("Status atualizado.");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível atualizar o status.");
    }
  }

  if (loading) return <p className="text-[var(--invite-brown-soft)]">Carregando presentes...</p>;

  if (items.length === 0) {
    return <p className="text-[var(--invite-brown-soft)]">Nenhuma seleção de presente recebida.</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article className="invite-card-strong p-5" key={item.id}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="font-heading text-2xl text-[var(--invite-brown)]">
                {item.guest_name}
              </h3>
              <p className="text-sm text-[var(--invite-brown-soft)]">{item.guest_phone}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--invite-sage)]">
                {formatDisplayDateTime(item.created_at)}
              </p>
            </div>
            <p className="font-heading text-2xl text-[var(--invite-brown)]">
              {formatCurrencyFromCents(item.total_cents)}
            </p>
          </div>
          {item.message ? (
            <p className="mt-4 italic text-[var(--invite-brown-soft)]">"{item.message}"</p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            {(["pending", "paid", "cancelled"] as PaymentStatus[]).map((status) => (
              <button
                className="invite-button-secondary px-4 py-2 text-xs"
                disabled={item.payment_status === status}
                key={status}
                onClick={() => void updateStatus(item.id, status)}
                type="button"
              >
                {paymentStatusLabels[status]}
              </button>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
