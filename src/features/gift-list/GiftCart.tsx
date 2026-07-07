import { inviteData } from "@/config/invite";
import { formatCurrencyFromCents } from "@/lib/format";

export function GiftCart({ totalCents, submitting }: { totalCents: number; submitting: boolean }) {
  return (
    <aside className="invite-card-strong sticky top-6 p-6">
      <p className="text-xs uppercase tracking-[0.24em] text-[var(--invite-sage)]">Resumo</p>
      <p className="mt-3 font-heading text-3xl text-[var(--invite-brown)]">
        {formatCurrencyFromCents(totalCents)}
      </p>
      <div className="mt-5 rounded-2xl border border-[var(--invite-line)] p-4 text-sm text-[var(--invite-brown-soft)]">
        <p className="font-semibold text-[var(--invite-brown)]">PIX manual</p>
        <p className="mt-2">Chave: {inviteData.giftList.pixKey || "Configure a chave PIX"}</p>
        <p>Nome: {inviteData.giftList.pixName || "Configure o nome do recebedor"}</p>
        <p className="mt-3">{inviteData.giftList.instructions}</p>
      </div>
      <button
        className="invite-button-primary mt-6 w-full"
        disabled={submitting || totalCents <= 0}
        type="submit"
      >
        {submitting ? "Salvando..." : "Finalizar escolha"}
      </button>
    </aside>
  );
}
