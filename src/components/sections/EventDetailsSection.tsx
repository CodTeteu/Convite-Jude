import { useState } from "react";
import { CalendarPlus2, Copy, Map, Shirt, Clock3, CalendarDays, MapPinned } from "lucide-react";
import { toast } from "sonner";
import { inviteData } from "@/config/invite";
import { buildGoogleCalendarUrl } from "@/lib/calendar";
import { copyToClipboard } from "@/lib/format";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const details = [
  {
    icon: CalendarDays,
    label: "Data",
    value: inviteData.event.dateText,
  },
  {
    icon: Clock3,
    label: "Horário",
    value: inviteData.event.timeText,
  },
  {
    icon: Shirt,
    label: "Traje",
    value: inviteData.event.dressCode,
  },
  {
    icon: MapPinned,
    label: "Local",
    value: inviteData.event.venueName,
  },
];

export function EventDetailsSection() {
  const [copying, setCopying] = useState(false);

  async function handleCopy() {
    try {
      setCopying(true);
      await copyToClipboard(inviteData.event.venue);
      toast.success("Endereço copiado com sucesso.");
    } catch {
      toast.error("Não foi possível copiar o endereço.");
    } finally {
      setCopying(false);
    }
  }

  return (
    <section className="section-shell" id="evento">
      <SectionHeading
        label="Detalhes do evento"
        title="Uma única celebração. Um endereço memorável. Um encontro muito esperado."
        description="Tudo foi pensado para uma noite sóbria, elegante e acolhedora, sem programações paralelas ou etapas extras."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <Reveal className="panel-luxe px-6 py-7 sm:px-8">
          <div className="grid grid-cols-2 gap-4">
            {details.map((item, index) => (
              <div
                key={item.label}
                className="card-luxe px-4 py-5"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <item.icon className="size-5 text-[color:var(--color-gold-soft)]" />
                <p className="mt-4 text-[0.68rem] uppercase tracking-[0.28em] text-white/52">
                  {item.label}
                </p>
                <p className="mt-2 text-base text-[color:var(--color-paper)]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="glass-line my-7" />

          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[color:var(--color-gold-soft)]/72">
            Endereço completo
          </p>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-white/76">
            {inviteData.event.venue}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              className="button-primary"
              href={inviteData.event.mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Map className="mr-2 size-4" />
              Abrir rota
            </a>
            <button className="button-secondary" onClick={handleCopy} type="button">
              <Copy className="mr-2 size-4" />
              {copying ? "Copiando..." : "Copiar endereço"}
            </button>
            <a className="button-ghost" href={buildGoogleCalendarUrl()} target="_blank" rel="noreferrer">
              <CalendarPlus2 className="mr-2 size-4" />
              Salvar agenda
            </a>
          </div>
        </Reveal>

        <Reveal className="card-luxe overflow-hidden border-[color:var(--color-gold)]/16 bg-[linear-gradient(180deg,rgba(195,164,107,0.08),rgba(255,255,255,0.03))] px-6 py-7 sm:px-8">
          <p className="section-label">Presença e acolhimento</p>
          <h3 className="mt-6 text-3xl text-[color:var(--color-paper)] sm:text-4xl">
            Uma noite feita para celebrar com presença inteira.
          </h3>
          <p className="mt-5 text-base leading-8 text-white/70">
            Mais do que um evento, esta data marca um ciclo de coragem, estudo, fé e
            vocação. Sua presença é parte importante dessa memória.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-[24px] border border-white/10 bg-black/10 px-5 py-5">
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[color:var(--color-gold-soft)]/72">
                Prazo do RSVP
              </p>
              <p className="mt-2 text-lg text-[color:var(--color-paper)]">
                Até {inviteData.event.confirmationDeadline}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/10 px-5 py-5">
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[color:var(--color-gold-soft)]/72">
                Observação importante
              </p>
              <p className="mt-2 text-base leading-7 text-white/74">
                Não há cobrança, não existe área de presentes e o convite contempla
                apenas este único evento.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
