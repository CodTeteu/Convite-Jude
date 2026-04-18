import { inviteData } from "@/config/invite";
import { useCountdown } from "@/hooks/useCountdown";
import { Reveal } from "@/components/ui/Reveal";

const labels = [
  { key: "days", label: "Dias" },
  { key: "hours", label: "Horas" },
  { key: "minutes", label: "Minutos" },
  { key: "seconds", label: "Segundos" },
] as const;

export function CountdownSection() {
  const countdown = useCountdown(inviteData.event.startsAt);

  return (
    <section className="section-shell">
      <Reveal className="panel-luxe overflow-hidden px-5 py-8 sm:px-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="section-label">Contagem regressiva</p>
            <h2 className="mt-5 text-3xl text-[color:var(--color-paper)] sm:text-4xl">
              Faltam poucos instantes para uma noite de celebração inesquecível.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-white/68">
              Cada segundo aproxima este encontro de gratidão, elegância e emoção.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {labels.map((item, index) => (
              <Reveal
                key={item.key}
                delay={0.08 + index * 0.06}
                className="card-luxe border-[color:var(--color-gold)]/14 bg-[linear-gradient(180deg,rgba(195,164,107,0.09),rgba(255,255,255,0.04))] px-4 py-5 text-center"
              >
                <p className="font-display text-5xl leading-none text-[color:var(--color-paper)]">
                  {String(countdown[item.key]).padStart(2, "0")}
                </p>
                <p className="mt-3 text-[0.7rem] uppercase tracking-[0.32em] text-[color:var(--color-gold-soft)]/72">
                  {item.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
