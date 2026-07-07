import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import type { GiftItem } from "@shared/schemas";
import { eventSlug, inviteData } from "@/config/invite";
import { GiftCard } from "@/features/gift-list/GiftCard";
import { GiftCart } from "@/features/gift-list/GiftCart";
import { fetchGifts, submitGiftSelection } from "@/lib/api";

export default function GiftListPage() {
  const [items, setItems] = useState<GiftItem[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGifts()
      .then((response) => setItems(response.items))
      .catch((error) =>
        toast.error(error instanceof Error ? error.message : "Não foi possível carregar os presentes."),
      )
      .finally(() => setLoading(false));
  }, []);

  const selectedItems = useMemo(
    () => items.filter((item) => (quantities[item.id] ?? 0) > 0),
    [items, quantities],
  );
  const totalCents = selectedItems.reduce(
    (sum, item) => sum + item.price_cents * (quantities[item.id] ?? 0),
    0,
  );

  if (!inviteData.features.giftList || !inviteData.giftList.enabled) {
    return <Navigate replace to="/" />;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSubmitting(true);
      await submitGiftSelection({
        guest_name: guestName,
        guest_phone: guestPhone,
        message,
        event_slug: eventSlug,
        items: selectedItems.map((item) => ({
          gift_item_id: item.id,
          quantity: quantities[item.id] ?? 0,
        })),
      });
      toast.success("Sua escolha foi salva. Faça o PIX com o valor indicado.");
      setQuantities({});
      setGuestName("");
      setGuestPhone("");
      setMessage("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar sua escolha.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="invite-page min-h-screen px-4 py-8">
      <div className="invite-container">
        <Link className="text-sm uppercase tracking-[0.2em] text-[var(--invite-sage)]" to="/">
          Voltar ao convite
        </Link>
        <header className="mt-8 max-w-3xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-[var(--invite-sage)]">
            Presentes
          </p>
          <h1 className="mt-3 font-heading text-5xl text-[var(--invite-brown)]">
            {inviteData.giftList.title}
          </h1>
          <p className="mt-4 text-lg text-[var(--invite-brown-soft)]">
            {inviteData.giftList.description}
          </p>
        </header>

        {loading ? <p className="mt-10 text-[var(--invite-brown-soft)]">Carregando presentes...</p> : null}

        <form className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]" onSubmit={handleSubmit}>
          <div>
            <div className="grid gap-6 md:grid-cols-2">
              {items.map((item) => (
                <GiftCard
                  item={item}
                  key={item.id}
                  quantity={quantities[item.id] ?? 0}
                  onChange={(quantity) =>
                    setQuantities((current) => ({ ...current, [item.id]: quantity }))
                  }
                />
              ))}
            </div>
            <div className="invite-card mt-8 grid gap-4 p-5 md:grid-cols-2">
              <input
                className="rounded-2xl border border-[var(--invite-line)] bg-transparent px-4 py-3"
                onChange={(event) => setGuestName(event.target.value)}
                placeholder="Seu nome"
                value={guestName}
              />
              <input
                className="rounded-2xl border border-[var(--invite-line)] bg-transparent px-4 py-3"
                onChange={(event) => setGuestPhone(event.target.value)}
                placeholder="Seu WhatsApp"
                value={guestPhone}
              />
              <textarea
                className="rounded-2xl border border-[var(--invite-line)] bg-transparent px-4 py-3 md:col-span-2"
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Mensagem opcional"
                value={message}
              />
            </div>
          </div>
          <GiftCart submitting={submitting} totalCents={totalCents} />
        </form>
      </div>
    </div>
  );
}
