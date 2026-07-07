import { inviteData } from "@/config/invite";
import { Reveal } from "@/components/ui/Reveal";

export function MenuSection() {
  if (!inviteData.menu?.enabled) return null;

  return (
    <section className="invite-section relative bg-[var(--invite-cream)] overflow-hidden" id="cardapio">
      {/* Background pattern and blobs */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-20 left-10 w-80 h-80 bg-[var(--invite-brown)] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--invite-gold)] rounded-full blur-3xl" />
      </div>

      <div className="invite-container relative z-10">
        {/* Header */}
        <Reveal className="text-center mb-16">
          <p className="font-heading text-[var(--invite-sage)] uppercase tracking-[0.3em] text-xs mb-3">
            {inviteData.menu.label}
          </p>
          <h2 className="font-script italic font-medium text-4xl md:text-6xl text-[var(--invite-brown)] mb-2">
            {inviteData.menu.title}
          </h2>
          <p className="font-heading text-base text-[var(--invite-brown-soft)]/70">
            {inviteData.menu.description}
          </p>
          <div className="decorative-line mt-5" />
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-stretch">
          
          {/* Left Column — Jantar Info Card (Clean & Sophisticated, No Images) */}
          <Reveal className="relative flex flex-col justify-center animate-in fade-in" delay={0.1}>
            <div className="relative h-full flex flex-col justify-center">
              {/* Slate/Navy dark background for contrast with the white paper card */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--invite-brown)] to-[#0A1628] rounded-[32px] shadow-xl" />
              
              <div className="relative text-white rounded-[32px] border border-white/10 px-8 py-10 md:px-10 md:py-14 overflow-hidden flex-1 flex flex-col justify-between">
                {/* Decorative glows */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--invite-gold)]/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[var(--invite-gold)]/5 rounded-full blur-3xl" />
                
                {/* Inner border decoration */}
                <div className="absolute inset-4 md:inset-5 border border-white/10 rounded-2xl pointer-events-none" />

                <div className="space-y-6 relative z-10 my-auto text-center">
                  <p className="font-heading text-xs uppercase tracking-[0.3em] text-[var(--invite-gold)]">
                    Jantar de Celebração
                  </p>
                  
                  <div className="space-y-2">
                    <h3 className="font-script italic font-normal text-4xl md:text-5xl text-white">
                      Uma Noite Especial
                    </h3>
                    <div className="w-12 h-[1px] bg-[var(--invite-gold)]/30 mx-auto mt-2" />
                  </div>

                  <p className="font-sans text-sm text-white/70 leading-relaxed max-w-sm mx-auto">
                    Para comemorar esta grande conquista, convidamos você para um jantar festivo preparado com muito carinho.
                  </p>

                  <div className="py-4 space-y-4">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Data & Horário</span>
                      <span className="font-heading text-base text-[var(--invite-gold-soft)] font-medium">8 de Agosto de 2026</span>
                      <span className="font-script text-2xl text-[var(--invite-gold)] mt-0.5">às 19h30</span>
                    </div>

                    <div className="w-8 h-[1px] bg-white/10 mx-auto" />

                    <div className="flex flex-col items-center">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Local</span>
                      <span className="font-heading text-base text-[var(--invite-gold-soft)] font-medium">{inviteData.event.venueName}</span>
                      <span className="font-sans text-xs text-white/60 mt-1 max-w-xs">{inviteData.event.venue}</span>
                    </div>
                  </div>

                  <p className="font-sans text-[11px] text-[var(--invite-gold-soft)]/50 italic">
                    * Sua presença é o nosso maior presente.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right Column — Menu Card (Paper Style, longer, taller and detailed) */}
          <Reveal delay={0.2}>
            <div className="relative h-full flex flex-col justify-center">
              {/* Tilted background for realistic paper effect */}
              <div className="absolute inset-0 bg-[#fffbf2] rounded-3xl shadow-xl transform rotate-1 transition-transform duration-500 hover:rotate-0" />
              
              <div className="relative bg-white/95 rounded-3xl shadow-sm border border-[var(--invite-line)]/40 px-6 py-10 md:px-12 md:py-16 overflow-hidden flex-1 flex flex-col justify-between">
                {/* Inner border decoration */}
                <div className="absolute inset-4 md:inset-5 border border-[var(--invite-gold)]/15 rounded-2xl pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[2px] bg-[var(--invite-gold)]/25" />

                <div className="space-y-12 relative z-10 my-auto">
                  {inviteData.menu.courses.map((course, index) => (
                    <div key={course.category} className="text-center group">
                      <h3 className="font-body italic text-2xl md:text-3.5xl text-[var(--invite-brown)] tracking-wide mb-4 transition-transform duration-300 group-hover:scale-105">
                        {course.category}
                      </h3>
                      
                      {/* Vertical line items */}
                      <ul className="space-y-2 max-w-sm mx-auto">
                        {course.items.map((item) => (
                          <li 
                            key={item} 
                            className="font-sans text-sm md:text-[15px] leading-relaxed text-[var(--invite-brown-soft)] tracking-wider flex items-center justify-center gap-2"
                          >
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--invite-gold)]/40" />
                            {item}
                          </li>
                        ))}
                      </ul>

                      {/* Ornate Divider between courses */}
                      {index < inviteData.menu.courses.length - 1 && (
                        <div className="flex justify-center items-center gap-3 mt-10 opacity-35">
                          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[var(--invite-gold)]" />
                          <span className="text-xs text-[var(--invite-gold)] select-none">✦</span>
                          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[var(--invite-gold)]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-[2px] bg-[var(--invite-gold)]/25" />
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
