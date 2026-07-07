import type { GiftItem } from "@shared/schemas";
import { formatCurrencyFromCents } from "@/lib/format";

export function GiftCard({
  item,
  quantity,
  onChange,
}: {
  item: GiftItem;
  quantity: number;
  onChange: (quantity: number) => void;
}) {
  return (
    <article className="invite-card flex flex-col overflow-hidden">
      {item.image_url ? (
        <img alt={item.name} className="h-48 w-full object-cover" src={item.image_url} />
      ) : null}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--invite-sage)]">
          {item.category}
        </p>
        <h2 className="mt-2 font-heading text-2xl text-[var(--invite-brown)]">
          {item.name}
        </h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--invite-brown-soft)]">
          {item.description}
        </p>
        <p className="mt-4 font-heading text-xl text-[var(--invite-brown)]">
          {formatCurrencyFromCents(item.price_cents)}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <button
            className="invite-button-secondary px-4 py-2"
            onClick={() => onChange(Math.max(0, quantity - 1))}
            type="button"
          >
            -
          </button>
          <span className="min-w-8 text-center text-lg text-[var(--invite-brown)]">
            {quantity}
          </span>
          <button
            className="invite-button-secondary px-4 py-2"
            onClick={() => onChange(quantity + 1)}
            type="button"
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}
