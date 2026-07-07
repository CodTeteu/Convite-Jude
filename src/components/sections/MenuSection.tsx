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

        {/* Single Integrated Menu Card with Blue Background */}
        <div className="max-w-2xl mx-auto">
          <Reveal delay={0.15}>
            <div className="relative">
              {/* Outer Shadow glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--invite-brown)] to-[#0A1628] rounded-[32px] shadow-xl" />
              
              <div className="relative text-white rounded-[32px] border border-white/10 px-6 py-10 md:px-12 md:py-14 overflow-hidden">
                {/* Inner gold border decoration */}
                <div className="absolute inset-4 md:inset-5 border border-[var(--invite-gold)]/20 rounded-[24px] pointer-events-none" />

                {/* Event Info Header (Top of the Card) */}
                <div className="text-center pb-8 border-b border-white/10 relative z-10">
                  <p className="font-heading text-xs uppercase tracking-[0.3em] text-[var(--invite-gold)] mb-2">
                    Jantar de Celebração
                  </p>
                  <h3 className="font-script italic font-normal text-3.5xl md:text-5xl text-white mb-3">
                    Uma Noite Especial
                  </h3>
                  <div className="flex flex-col items-center gap-1 mt-4">
                    <span className="font-heading text-xs md:text-sm text-[var(--invite-gold-soft)] font-medium tracking-wide">
                      8 de Agosto de 2026 às 19h30
                    </span>
                    <span className="font-sans text-xs text-white/50 tracking-wide max-w-md">
                      {inviteData.event.venueName} &bull; {inviteData.event.venue}
                    </span>
                  </div>
                </div>

                {/* Menu Items (Bottom of the Card) */}
                <div className="pt-8 space-y-10 relative z-10">
                  {inviteData.menu.courses.map((course, index) => (
                    <div key={course.category} className="text-center group">
                      <h4 className="font-body italic text-xl md:text-2xl text-[var(--invite-gold)] tracking-wide mb-3 transition-transform duration-300 group-hover:scale-105">
                        {course.category}
                      </h4>
                      
                      {/* Vertical line items */}
                      <ul className="space-y-1.5 max-w-sm mx-auto">
                        {course.items.map((item) => (
                          <li 
                            key={item} 
                            className="font-sans text-xs md:text-sm leading-relaxed text-white/80 tracking-wider flex items-center justify-center gap-2"
                          >
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--invite-gold)]/40" />
                            {item}
                          </li>
                        ))}
                      </ul>

                      {/* Ornate Divider between courses */}
                      {index < inviteData.menu.courses.length - 1 && (
                        <div className="flex justify-center items-center gap-3 mt-8 opacity-25">
                          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[var(--invite-gold)]" />
                          <span className="text-xs text-[var(--invite-gold)] select-none">✦</span>
                          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[var(--invite-gold)]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
}
