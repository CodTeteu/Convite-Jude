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
    <section className="invite-section !pb-0" id="jornada">
      <div className="invite-container">
        <div className="text-center lg:hidden">
          <p className="font-heading text-[0.72rem] uppercase tracking-[0.32em] text-[var(--invite-sage)]">
            {inviteData.journey.label}
          </p>
          <h2 className="mt-4 font-script italic font-medium text-5xl text-[var(--invite-brown)] sm:text-6xl">
            {inviteData.journey.title}
          </h2>
          <div className="mt-6 text-center italic text-[var(--invite-brown)]/90">
            <p className="font-script italic text-2xl leading-[1.3] sm:text-3xl">
              {inviteData.graduate.signatureQuote}
            </p>
          </div>
        </div>

        <div className="mt-10 grid items-center gap-14 lg:mt-0 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <Reveal className="relative">
            <div className="relative overflow-hidden rounded-[34px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
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
          </Reveal>

          <Reveal className="space-y-7 text-center lg:text-left" delay={0.1}>
            <div className="hidden lg:block">
              <p className="font-heading text-[0.72rem] uppercase tracking-[0.32em] text-[var(--invite-sage)]">
                {inviteData.journey.label}
              </p>
              <h2 className="mt-4 font-script italic font-medium text-6xl text-[var(--invite-brown)]">
                {inviteData.journey.title}
              </h2>
              <div className="mt-6 text-center italic text-[var(--invite-brown)]/90 lg:text-left">
                <p className="font-script italic text-2xl leading-[1.3] sm:text-3xl">
                  {inviteData.graduate.signatureQuote}
                </p>
              </div>
            </div>

            <div className="text-center lg:text-left">
              <div className="space-y-6 pb-2 text-[var(--invite-brown-soft)]">
                {isExpanded ? (
                  <>
                    {inviteData.journey.paragraphs.map((paragraph, index) => (
                      <p className="font-body text-xl leading-relaxed sm:text-[1.38rem] lg:leading-loose" key={paragraph}>
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
                        <p className="font-body text-xl leading-relaxed sm:text-[1.38rem] lg:leading-loose" key={paragraph}>
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
