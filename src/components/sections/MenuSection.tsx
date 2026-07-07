import { inviteData } from "@/config/invite";
import { Reveal } from "@/components/ui/Reveal";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";

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

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-stretch">
          
          {/* Left Column — Visual Buffet Image with Offset Border */}
          <Reveal className="relative flex items-center justify-center" delay={0.1}>
            <div className="relative w-full h-full min-h-[350px] md:min-h-[450px]">
              {/* Decorative Frame */}
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[var(--invite-gold)]/20 rounded-3xl pointer-events-none" />
              
              {/* Main Image */}
              <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl relative">
                <ResponsiveImage
                  asset={inviteData.event.venueImageAsset}
                  alt={inviteData.event.venueName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Glowing decorative blobs around the frame */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[var(--invite-gold)]/10 rounded-full blur-3xl pointer-events-none" />
            </div>
          </Reveal>

          {/* Right Column — Menu Card (Paper Style, longer, taller and more detailed) */}
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
                      
                      {/* Vertical line items instead of joining them on one line */}
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
