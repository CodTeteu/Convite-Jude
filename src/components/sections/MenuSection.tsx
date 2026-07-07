import { inviteData } from "@/config/invite";
import { Reveal } from "@/components/ui/Reveal";

export function MenuSection() {
  if (!inviteData.menu?.enabled) return null;

  return (
    <section className="invite-section relative bg-[var(--invite-cream)]" id="cardapio">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--invite-brown)] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--invite-gold)] rounded-full blur-3xl" />
      </div>

      <div className="invite-container relative z-10">
        {/* Header */}
        <Reveal className="text-center mb-12">
          <p className="font-heading text-[var(--invite-sage)] uppercase tracking-[0.3em] text-xs mb-3">
            {inviteData.menu.label}
          </p>
          <h2 className="font-script italic font-medium text-3xl md:text-5xl text-[var(--invite-brown)] mb-2">
            {inviteData.menu.title}
          </h2>
          <p className="font-heading text-base text-[var(--invite-brown-soft)]/70">
            {inviteData.menu.description}
          </p>
          <div className="decorative-line mt-5" />
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Menu Card — Paper Style */}
          <Reveal delay={0.15}>
            <div className="relative">
              {/* Tilted background for paper effect */}
              <div className="absolute inset-0 bg-[#fffbf2] rounded-3xl shadow-xl transform rotate-1 transition-transform duration-500 hover:rotate-0" />
              <div className="relative bg-white/95 rounded-3xl shadow-sm border border-[var(--invite-line)]/40 p-6 md:p-10 overflow-hidden">
                {/* Inner frame decoration */}
                <div className="absolute inset-3 md:inset-4 border border-[var(--invite-gold)]/15 rounded-2xl pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-[var(--invite-gold)]/20" />

                <div className="space-y-8 relative z-10">
                  {inviteData.menu.courses.map((course, index) => (
                    <div key={course.category}>
                      <div className="text-center">
                        <h3 className="font-body italic text-2xl md:text-3xl text-[var(--invite-brown)] mb-3">
                          {course.category}
                        </h3>
                        <div className="max-w-sm mx-auto">
                          <p className="font-sans text-[var(--invite-brown-soft)] leading-relaxed text-sm">
                            {course.items.join(" \u2022 ")}
                          </p>
                        </div>
                      </div>

                      {/* Divider between courses (not after last) */}
                      {index < inviteData.menu.courses.length - 1 && (
                        <div className="flex justify-center mt-6 opacity-30">
                          <div className="w-2/3 h-[1px] bg-gradient-to-r from-transparent via-[var(--invite-gold)] to-transparent" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Event info aside */}
          <Reveal className="relative" delay={0.25}>
            <div className="bg-gradient-to-br from-[var(--invite-brown)] to-[#0A1628] rounded-3xl p-8 md:p-10 text-white overflow-hidden relative">
              {/* Decorative glow */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--invite-gold)]/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[var(--invite-gold)]/5 rounded-full blur-3xl" />

              <div className="relative z-10 text-center">
                <p className="font-heading text-xs uppercase tracking-[0.3em] text-[var(--invite-gold)] mb-4">
                  Jantar de Celebração
                </p>
                <h3 className="font-script italic font-medium text-3xl md:text-4xl text-white mb-4">
                  Uma noite especial
                </h3>
                <div className="decorative-line mb-6" />
                <p className="font-sans text-sm text-white/70 leading-relaxed max-w-sm mx-auto mb-6">
                  O jantar será servido no {inviteData.event.venueName}, em um ambiente preparado com carinho para celebrar essa conquista.
                </p>
                <div className="flex items-center justify-center gap-6 text-sm text-white/60">
                  <div className="text-center">
                    <span className="block font-script text-2xl text-[var(--invite-gold)]">{inviteData.event.timeText}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em]">Horário</span>
                  </div>
                  <div className="w-[1px] h-10 bg-white/15" />
                  <div className="text-center">
                    <span className="block font-script text-2xl text-[var(--invite-gold)]">{inviteData.event.dateLong.split(" ")[0]}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em]">{inviteData.event.dateLong.split(" ").slice(1, 4).join(" ")}</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
