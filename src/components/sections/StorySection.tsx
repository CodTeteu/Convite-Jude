import { useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { inviteData } from "@/config/invite";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { Reveal } from "@/components/ui/Reveal";

const PREVIEW_PARAGRAPH_COUNT = 2;

export function StorySection() {
  const [autoplay] = useState(() =>
    Autoplay({
      delay: 4500,
      stopOnInteraction: false,
    }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" }, [autoplay]);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="invite-section !pb-0 overflow-hidden" id="jornada">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-[var(--invite-gold)]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-[var(--invite-brown)]/5 rounded-full blur-3xl" />

      <div className="invite-container relative z-10">
        <div className="text-center lg:hidden">
          <p className="font-heading text-[0.72rem] uppercase tracking-[0.32em] text-[var(--invite-sage)]">
            {inviteData.journey.label}
          </p>
          <h2 className="mt-4 font-script italic font-medium text-5xl text-[var(--invite-brown)] sm:text-6xl">
            {inviteData.journey.title}
          </h2>
          <div className="relative py-4 px-6 border-l border-[var(--invite-gold)] bg-[var(--invite-sand)]/10 rounded-r-2xl my-6 max-w-xl mx-auto text-left shadow-[inset_0_0_12px_rgba(207,201,194,0.06)]">
            <span className="absolute -top-3 left-4 text-4xl font-serif text-[var(--invite-gold)]/40 font-bold select-none">“</span>
            <p className="font-script italic text-lg leading-relaxed text-[var(--invite-brown-soft)] sm:text-xl pl-2">
              {inviteData.graduate.signatureQuote}
            </p>
          </div>
        </div>

        <div className="mt-10 grid items-center gap-14 lg:mt-0 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <Reveal className="relative">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl relative">
              <div className="overflow-hidden h-full" ref={emblaRef}>
                <div className="flex h-full">
                  {inviteData.journey.images.map((image) => (
                    <div className="min-w-0 flex-[0_0_100%]" key={image.asset}>
                      <div className="aspect-[3/4]">
                        <ResponsiveImage
                          asset={image.asset}
                          alt={image.alt}
                          className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]"
                          sizes="(min-width: 1024px) 40vw, 92vw"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                className="absolute left-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/80 text-[var(--invite-brown)] shadow-lg"
                onClick={() => emblaApi?.scrollPrev()}
                type="button"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                className="absolute right-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/80 text-[var(--invite-brown)] shadow-lg"
                onClick={() => emblaApi?.scrollNext()}
                type="button"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
            {/* Decorative offset frame */}
            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[var(--invite-gold)]/15 rounded-3xl pointer-events-none" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[var(--invite-gold)]/10 rounded-full blur-3xl" />
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-[var(--invite-brown)]/8 rounded-full blur-2xl" />
          </Reveal>

          <Reveal className="space-y-7 text-center lg:text-left" delay={0.1}>
            <div className="hidden lg:block">
              <p className="font-heading text-[0.72rem] uppercase tracking-[0.32em] text-[var(--invite-sage)]">
                {inviteData.journey.label}
              </p>
              <h2 className="mt-4 font-script italic font-medium text-6xl text-[var(--invite-brown)]">
                {inviteData.journey.title}
              </h2>
              <div className="relative py-4 px-6 border-l border-[var(--invite-gold)] bg-[var(--invite-sand)]/10 rounded-r-2xl my-6 text-left shadow-[inset_0_0_12px_rgba(207,201,194,0.06)]">
                <span className="absolute -top-3 left-4 text-4xl font-serif text-[var(--invite-gold)]/40 font-bold select-none">“</span>
                <p className="font-script italic text-lg leading-relaxed text-[var(--invite-brown-soft)] sm:text-xl pl-2">
                  {inviteData.graduate.signatureQuote}
                </p>
              </div>
            </div>

            <div className="text-center lg:text-left">
              <div className="space-y-6 pb-2 text-[var(--invite-brown-soft)]">
                {isExpanded ? (
                  <>
                    {inviteData.journey.paragraphs.map((paragraph, index) => (
                      <p className="font-body text-base leading-relaxed sm:text-xl lg:text-[1.25rem] lg:leading-loose" key={paragraph}>
                        {paragraph}
                        {index === inviteData.journey.paragraphs.length - 1 && (
                          <button
                            className="ml-3 inline-flex font-heading text-[0.75rem] font-bold uppercase tracking-[0.25em] text-[var(--invite-gold)] transition-colors hover:text-[var(--invite-brown)]"
                            onClick={() => setIsExpanded(false)}
                            type="button"
                          >
                            Ler menos
                          </button>
                        )}
                      </p>
                    ))}
                  </>
                ) : (
                  <>
                    {inviteData.journey.paragraphs
                      .slice(0, PREVIEW_PARAGRAPH_COUNT)
                      .map((paragraph, index) => (
                        <p className="font-body text-base leading-relaxed sm:text-xl lg:text-[1.25rem] lg:leading-loose" key={paragraph}>
                          {paragraph}
                          {index === PREVIEW_PARAGRAPH_COUNT - 1 && (
                            <>
                              ...
                              <button
                                className="ml-3 inline-flex font-heading text-[0.75rem] font-bold uppercase tracking-[0.25em] text-[var(--invite-gold)] transition-colors hover:text-[var(--invite-brown)]"
                                onClick={() => setIsExpanded(true)}
                                type="button"
                              >
                                Ver mais
                              </button>
                            </>
                          )}
                        </p>
                      ))}
                  </>
                )}
              </div>
            </div>

          </Reveal>
        </div>
      </div>
    </section>
  );
}
