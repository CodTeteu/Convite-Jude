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
  "Colação de Grau": Calendar,
  "Jantar de Celebração": Clock3,
  "Traje": Shirt,
  "Confirmação": Users,
  "Estacionamento": Car,
  "Fotos": Camera,
  "Bingo Especial": Ticket,
};

export function CelebrationSection() {
  const [copyingText, setCopyingText] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  async function handleCopyAddress(address: string) {
    try {
      setCopyingText(address);
      await copyToClipboard(address);
      toast.success("Endereço copiado com sucesso.");
    } catch {
      toast.error("Não foi possível copiar o endereço.");
    } finally {
      setTimeout(() => setCopyingText(null), 2000);
    }
  }

  const colacaoAddress = "Rua 3, Qd 27, Lts 05 a 16, nº 1346 - Setor Waldir Lins I, Gurupi - TO";
  const colacaoMapsUrl = "https://www.google.com/maps/search/?api=1&query=Palaciu%27s+Real+Eventos+Gurupi";
  const colacaoWazeUrl = "https://waze.com/ul?q=Palaciu%27s+Real+Eventos+Gurupi&navigate=yes";
  const colacaoCalendarUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Colação+de+Grau+-+Joana+Darc&dates=20260807T220000Z/20260808T010000Z&details=Colação+de+Grau+de+Psicologia+da+Joana+Darc&location=Espaço+Palaciu's+Real+Eventos+-+Gurupi+TO";

  return (
    <section className="invite-section relative overflow-hidden" id="celebracao">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
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
        <div className="flex overflow-x-auto md:grid md:grid-cols-2 gap-8 pb-6 md:pb-0 scroll-smooth snap-x snap-mandatory no-scrollbar -mx-4 px-6 md:mx-0 md:px-0 mt-14">

          {/* Card 1 — Colação de Grau */}
          <Reveal className="bg-white rounded-[32px] shadow-xl border border-[var(--invite-line)]/40 flex flex-col justify-between snap-start shrink-0 w-[290px] sm:w-[320px] md:w-auto md:shrink p-4 md:p-5 relative group overflow-hidden">
            {/* Inner Gold Frame */}
            <div className="absolute inset-2 border border-[var(--invite-gold)]/10 rounded-[24px] pointer-events-none" />

            <div className="relative z-10">
              {/* Framed Image */}
              <div className="aspect-[16/10] overflow-hidden rounded-2xl shadow-sm border border-[var(--invite-line)]/20 relative">
                <ResponsiveImage
                  asset="hero/venue.jpg"
                  alt="Colação de Grau"
                  className="w-full h-full object-cover object-[center_25%] transition-transform duration-700 group-hover:scale-103"
                />
              </div>

              {/* Card Body */}
              <div className="pt-6 pb-3 px-2 text-center">
                <div className="inline-flex items-center gap-1.5 justify-center mb-2 px-3 py-1 bg-[var(--invite-sage-soft)]/20 rounded-full border border-[var(--invite-sage)]/10">
                  <Calendar className="w-3.5 h-3.5 text-[var(--invite-gold-deep)]" />
                  <span className="font-heading text-[10px] uppercase tracking-[0.2em] text-[var(--invite-brown)]/80">Colação de Grau</span>
                </div>
                <p className="font-heading text-lg md:text-xl font-semibold text-[var(--invite-brown)] tracking-wide">
                  7 de agosto de 2026
                </p>
                <p className="font-script italic text-2xl text-[var(--invite-gold-deep)] mt-0.5">
                  às 19h00
                </p>
              </div>

              {/* Address details inside framed box */}
              <div className="px-2 pb-4">
                <p className="font-heading text-[10px] uppercase tracking-[0.2em] text-[var(--invite-sage)] mb-1 text-center">Local da Colação</p>
                <p className="font-sans text-xs text-[var(--invite-brown-soft)] mb-3 font-semibold text-center">Espaço Palaciu&apos;s Real Eventos</p>
                
                <div className="group/copy relative rounded-xl border border-[var(--invite-gold)]/15 bg-[#fffbf2]/70 px-4 py-3 transition-all duration-300 hover:bg-[#fffbf2]">
                  <p className="pr-6 font-sans text-[11px] leading-relaxed text-[var(--invite-brown-soft)] text-center">
                    {colacaoAddress}
                  </p>
                  <button
                    onClick={() => void handleCopyAddress(colacaoAddress)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--invite-brown-soft)]/40 transition-colors hover:text-[var(--invite-brown)]"
                    title="Copiar endereço"
                  >
                    {copyingText === colacaoAddress ? <Check className="size-3.5 text-[var(--invite-gold)]" /> : <Copy className="size-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Structured action buttons */}
            <div className="relative z-10 pt-2 flex flex-col gap-2 px-2 pb-2">
              <a
                className="w-full inline-flex items-center justify-center gap-2 bg-[var(--invite-brown)] hover:bg-[var(--invite-brown-soft)] text-white px-4 py-3 rounded-full font-heading tracking-widest text-xs transition-colors duration-300 shadow-sm"
                href={colacaoCalendarUrl}
                rel="noreferrer"
                target="_blank"
              >
                <Calendar className="w-3.5 h-3.5" />
                Salvar na Agenda
              </a>
              <div className="grid grid-cols-2 gap-2">
                <a
                  className="inline-flex items-center justify-center gap-1.5 bg-[var(--invite-cream)]/60 hover:bg-[var(--invite-sage-soft)]/30 text-[var(--invite-brown)] border border-[var(--invite-line)]/50 px-3 py-2.5 rounded-full font-sans text-[10px] font-semibold transition-all duration-300"
                  href={colacaoMapsUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <MapPin className="w-3 h-3 text-[var(--invite-gold)]" />
                  Google Maps
                </a>
                <a
                  className="inline-flex items-center justify-center gap-1.5 bg-[var(--invite-cream)]/60 hover:bg-[var(--invite-sage-soft)]/30 text-[var(--invite-brown)] border border-[var(--invite-line)]/50 px-3 py-2.5 rounded-full font-sans text-[10px] font-semibold transition-all duration-300"
                  href={colacaoWazeUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Navigation className="w-3 h-3 text-[var(--invite-gold)]" />
                  Waze
                </a>
              </div>
            </div>
          </Reveal>

          {/* Card 2 — Jantar de Celebração */}
          <Reveal className="bg-white rounded-[32px] shadow-xl border border-[var(--invite-line)]/40 flex flex-col justify-between snap-start shrink-0 w-[290px] sm:w-[320px] md:w-auto md:shrink p-4 md:p-5 relative group overflow-hidden" delay={0.08}>
            {/* Inner Gold Frame */}
            <div className="absolute inset-2 border border-[var(--invite-gold)]/10 rounded-[24px] pointer-events-none" />

            <div className="relative z-10">
              {/* Framed Image */}
              <div className="aspect-[16/10] overflow-hidden rounded-2xl shadow-sm border border-[var(--invite-line)]/20 relative bg-[var(--invite-sage-soft)]">
                <ResponsiveImage
                  asset={inviteData.event.venueImageAsset}
                  alt={inviteData.event.venueName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                />
              </div>

              {/* Card Body */}
              <div className="pt-6 pb-3 px-2 text-center">
                <div className="inline-flex items-center gap-1.5 justify-center mb-2 px-3 py-1 bg-[var(--invite-sage-soft)]/20 rounded-full border border-[var(--invite-sage)]/10">
                  <MapPin className="w-3.5 h-3.5 text-[var(--invite-gold-deep)]" />
                  <span className="font-heading text-[10px] uppercase tracking-[0.2em] text-[var(--invite-brown)]/80">Jantar de Celebração</span>
                </div>
                <p className="font-heading text-lg md:text-xl font-semibold text-[var(--invite-brown)] tracking-wide">
                  8 de agosto de 2026
                </p>
                <p className="font-script italic text-2xl text-[var(--invite-gold-deep)] mt-0.5">
                  {inviteData.event.timeText}
                </p>
              </div>

              {/* Address details inside framed box */}
              <div className="px-2 pb-4">
                <p className="font-heading text-[10px] uppercase tracking-[0.2em] text-[var(--invite-sage)] mb-1 text-center">Local do Jantar</p>
                <p className="font-sans text-xs text-[var(--invite-brown-soft)] mb-3 font-semibold text-center">{inviteData.event.venueName}</p>

                <div className="group/copy relative rounded-xl border border-[var(--invite-gold)]/15 bg-[#fffbf2]/70 px-4 py-3 transition-all duration-300 hover:bg-[#fffbf2]">
                  <p className="pr-6 font-sans text-[11px] leading-relaxed text-[var(--invite-brown-soft)] text-center">
                    {inviteData.event.venue}
                  </p>
                  <button
                    onClick={() => void handleCopyAddress(inviteData.event.venue)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--invite-brown-soft)]/40 transition-colors hover:text-[var(--invite-brown)]"
                    title="Copiar endereço"
                  >
                    {copyingText === inviteData.event.venue ? <Check className="size-3.5 text-[var(--invite-gold)]" /> : <Copy className="size-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Structured action buttons */}
            <div className="relative z-10 pt-2 flex flex-col gap-2 px-2 pb-2">
              <a
                className="w-full inline-flex items-center justify-center gap-2 bg-[var(--invite-brown)] hover:bg-[var(--invite-brown-soft)] text-white px-4 py-3 rounded-full font-heading tracking-widest text-xs transition-colors duration-300 shadow-sm"
                href={buildGoogleCalendarUrl()}
                rel="noreferrer"
                target="_blank"
              >
                <Calendar className="w-3.5 h-3.5" />
                Salvar na Agenda
              </a>
              <div className="grid grid-cols-2 gap-2">
                <a
                  className="inline-flex items-center justify-center gap-1.5 bg-[var(--invite-cream)]/60 hover:bg-[var(--invite-sage-soft)]/30 text-[var(--invite-brown)] border border-[var(--invite-line)]/50 px-3 py-2.5 rounded-full font-sans text-[10px] font-semibold transition-all duration-300"
                  href={inviteData.event.mapsUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <MapPin className="w-3 h-3 text-[var(--invite-gold)]" />
                  Google Maps
                </a>
                <a
                  className="inline-flex items-center justify-center gap-1.5 bg-[var(--invite-cream)]/60 hover:bg-[var(--invite-sage-soft)]/30 text-[var(--invite-brown)] border border-[var(--invite-line)]/50 px-3 py-2.5 rounded-full font-sans text-[10px] font-semibold transition-all duration-300"
                  href={inviteData.event.wazeUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Navigation className="w-3 h-3 text-[var(--invite-gold)]" />
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
