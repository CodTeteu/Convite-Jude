import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Check, Clock3, Copy, MapPin, Navigation, Shirt, Users, Camera, Ticket, Car, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { inviteData } from "@/config/invite";
import { buildGoogleCalendarUrl } from "@/lib/calendar";
import { copyToClipboard } from "@/lib/format";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII"];

const quickNoteIcons: Record<string, typeof Clock3> = {
  "Cola\u00e7\u00e3o de Grau": Calendar,
  "Jantar de Celebra\u00e7\u00e3o": Clock3,
  "Traje": Shirt,
  "Confirma\u00e7\u00e3o": Users,
  "Estacionamento": Car,
  "Fotos": Camera,
  "Bingo Especial": Ticket,
};

export function CelebrationSection() {
  const [copying, setCopying] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  async function handleCopyAddress() {
    try {
      setCopying(true);
      await copyToClipboard(inviteData.event.venue);
      toast.success("Endere\u00e7o copiado com sucesso.");
    } catch {
      toast.error("N\u00e3o foi poss\u00edvel copiar o endere\u00e7o.");
    } finally {
      setCopying(false);
    }
  }

  return (
    <section className="invite-section !pb-8 !pt-4 sm:!pb-12 sm:!pt-8 overflow-hidden" id="celebracao">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--invite-gold)] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--invite-brown)] rounded-full blur-3xl" />
      </div>

      <div className="invite-container relative z-10">
        <SectionHeading
          align="center"
          label={inviteData.celebration.label}
          title={inviteData.celebration.title}
        />

        {/* Horizontal scroll snap cards */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-2 gap-6 pb-6 md:pb-0 scroll-smooth snap-x snap-mandatory no-scrollbar -mx-4 px-6 md:mx-0 md:px-0 mt-14">

          {/* Card 1 — Data & Hor\u00e1rio / Cola\u00e7\u00e3o */}
          <Reveal className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[var(--invite-line)]/30 flex flex-col justify-between snap-start shrink-0 w-[290px] sm:w-[320px] md:w-auto md:shrink">
            <div>
              <div className="aspect-[16/10] relative">
                <ResponsiveImage
                  asset={inviteData.celebration.primaryImageAsset}
                  alt="Celebra\u00e7\u00e3o"
                  className="w-full h-full object-cover object-[center_25%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--invite-brown)]/90 via-[var(--invite-brown)]/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 opacity-80" />
                    <span className="font-heading text-sm tracking-widest uppercase opacity-80">Datas & Hor\u00e1rios</span>
                  </div>
                  <p className="font-heading text-base font-light mb-0.5">7 e 8 de agosto de 2026</p>
                  <p className="font-script italic text-3xl opacity-90">\u00e0s {inviteData.event.timeText}</p>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="space-y-3 mb-4">
                  <div>
                    <p className="font-heading text-xs uppercase tracking-[0.25em] text-[var(--invite-sage)] mb-1">Cola\u00e7\u00e3o de Grau</p>
                    <p className="font-sans text-sm text-[var(--invite-brown-soft)]">7 de agosto &mdash; Espa\u00e7o Palaciu&apos;s Real Eventos</p>
                  </div>
                  <div className="h-[1px] bg-[var(--invite-line)]" />
                  <div>
                    <p className="font-heading text-xs uppercase tracking-[0.25em] text-[var(--invite-sage)] mb-1">Jantar de Celebra\u00e7\u00e3o</p>
                    <p className="font-sans text-sm text-[var(--invite-brown-soft)]">8 de agosto &bull; {inviteData.event.timeText} &mdash; {inviteData.event.venueName}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 md:p-8 pt-0">
              <a
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--invite-brown)] to-[var(--invite-brown-soft)] text-white px-4 py-3 rounded-full font-sans text-sm hover:shadow-xl transition-all duration-300"
                href={buildGoogleCalendarUrl()}
                rel="noreferrer"
                target="_blank"
              >
                <Calendar className="w-4 h-4" />
                Salvar na Agenda
              </a>
            </div>
          </Reveal>

          {/* Card 2 — Local do Jantar */}
          <Reveal className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[var(--invite-line)]/30 flex flex-col justify-between snap-start shrink-0 w-[290px] sm:w-[320px] md:w-auto md:shrink" delay={0.08}>
            <div>
              <div className="aspect-[16/10] relative bg-[var(--invite-sage-soft)]">
                <ResponsiveImage
                  asset={inviteData.event.venueImageAsset}
                  alt={inviteData.event.venueName}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--invite-brown)]/90 via-[var(--invite-brown)]/40 to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 text-white pointer-events-none">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 opacity-80" />
                    <span className="font-heading text-sm tracking-widest uppercase opacity-80">Local do Jantar</span>
                  </div>
                  <p className="font-script italic text-2xl">{inviteData.event.venueName}</p>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="group relative rounded-2xl border border-[var(--invite-line)] bg-[var(--invite-sage-soft)]/30 px-4 py-4 transition-colors hover:bg-[var(--invite-sage-soft)]/50 mb-4">
                  <p className="pr-8 font-sans text-sm leading-relaxed text-[var(--invite-brown-soft)]">
                    {inviteData.event.venue}
                  </p>
                  <button
                    onClick={() => void handleCopyAddress()}
                    className="absolute right-4 top-4 text-[var(--invite-brown-soft)]/60 transition-colors hover:text-[var(--invite-brown)]"
                    title="Copiar endere\u00e7o"
                  >
                    {copying ? <Check className="size-4 text-[var(--invite-gold)]" /> : <Copy className="size-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 md:p-8 pt-0">
              <div className="flex flex-col gap-2">
                <a
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--invite-brown)] to-[var(--invite-brown-soft)] text-white px-4 py-3 rounded-full font-sans text-sm hover:shadow-xl transition-all duration-300"
                  href={inviteData.event.mapsUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <MapPin className="w-4 h-4" />
                  Google Maps
                </a>
                <a
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#33ccff] text-white px-4 py-3 rounded-full font-sans text-sm hover:shadow-xl hover:bg-[#2bb5eb] transition-all duration-300"
                  href={inviteData.event.wazeUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Navigation className="w-4 h-4" />
                  Waze
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Manual do Convidado — Desktop Grid */}
        {inviteData.celebration.quickNotes.length > 0 && (
          <>
            <div className="hidden md:grid md:grid-cols-4 gap-y-16 gap-x-8 mt-20">
              {inviteData.celebration.quickNotes.map((note, index) => {
                const Icon = quickNoteIcons[note.title] ?? Clock3;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center group"
                  >
                    <div className="w-14 h-14 bg-[var(--invite-brown)]/8 rounded-full flex items-center justify-center mb-5 text-[var(--invite-brown)] group-hover:scale-110 transition-transform duration-500">
                      <Icon className="w-5 h-5" strokeWidth={1.8} />
                    </div>
                    <h4 className="font-heading text-base text-[var(--invite-brown)] mb-2 tracking-wide">{note.title}</h4>
                    <p className="font-sans text-sm text-[var(--invite-brown-soft)]/70 leading-relaxed px-2 mb-4">
                      {note.description}
                    </p>
                    <div className="w-10 h-[2px] bg-[var(--invite-line)] opacity-50 group-hover:bg-[var(--invite-gold)]/30 transition-colors duration-500" />
                  </div>
                );
              })}
            </div>

            {/* Manual do Convidado — Mobile Accordion */}
            <div className="block md:hidden mt-12 divide-y divide-[var(--invite-brown)]/10 border-t border-b border-[var(--invite-brown)]/10">
              {inviteData.celebration.quickNotes.map((note, index) => {
                const isExpanded = expandedItem === note.title;
                return (
                  <div key={index} className="overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedItem(isExpanded ? null : note.title)}
                      className="w-full flex items-center justify-between py-5 text-left transition-colors duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-heading text-xs text-[var(--invite-brown)]/60 tracking-[0.2em] font-light">
                          {ROMAN_NUMERALS[index] || index + 1}
                        </span>
                        <span className="text-[var(--invite-brown)]/20 font-light">|</span>
                        <h4 className="font-heading text-base text-[var(--invite-brown)] tracking-wide font-normal">
                          {note.title}
                        </h4>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-[var(--invite-brown)]/60"
                      >
                        <ChevronDown className="w-4 h-4 stroke-[1.2]" />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <div className="pb-5 pl-10 pr-2 font-sans text-sm text-[var(--invite-brown-soft)]/80 leading-relaxed">
                            {note.description}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
