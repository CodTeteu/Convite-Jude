import { useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { inviteData } from "@/config/invite";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

export function FamilyGallerySection() {
  const [autoplay] = useState(() =>
    Autoplay({
      delay: 3600,
      stopOnInteraction: false,
    }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center", loop: true }, [autoplay]);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="invite-section !pt-4 sm:!pt-8 !pb-4 sm:!pb-8" id="familia">
      <div className="invite-container">
        <SectionHeading
          align="center"
          description={inviteData.familyGallery.description}
          label={inviteData.familyGallery.label}
          title={inviteData.familyGallery.title}
        />

        <Reveal className="mt-12" delay={0.05}>
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="-ml-4 flex">
                {inviteData.familyGallery.slides.map((slide) => (
                  <div
                    className="min-w-0 flex-[0_0_86%] pl-4 md:flex-[0_0_52%] lg:flex-[0_0_34%]"
                    key={slide.asset}
                  >
                    <figure className="overflow-hidden rounded-[30px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
                      <div className="aspect-[4/3]">
                        <ResponsiveImage
                          asset={slide.asset}
                          alt={slide.alt}
                          className={cn(
                            "h-full w-full object-cover transition duration-500 hover:scale-[1.03]",
                            slide.positionClass,
                          )}
                          sizes="(min-width: 1024px) 34vw, (min-width: 768px) 52vw, 86vw"
                        />
                      </div>
                      <figcaption className="px-5 py-5">
                        <p className="font-body text-lg leading-relaxed text-[var(--invite-brown-soft)] sm:text-xl">
                          {slide.caption}
                        </p>
                      </figcaption>
                    </figure>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="absolute left-2 top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#ccb89a] bg-[var(--invite-paper)] text-[#4c3a2f] shadow-lg md:inline-flex"
              onClick={() => emblaApi?.scrollPrev()}
              type="button"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              className="absolute right-2 top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#ccb89a] bg-[var(--invite-paper)] text-[#4c3a2f] shadow-lg md:inline-flex"
              onClick={() => emblaApi?.scrollNext()}
              type="button"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </Reveal>

        <Reveal className="mt-10" delay={0.1}>
          <div className="space-y-5 text-center text-[var(--invite-brown-soft)] md:text-left">
            {isExpanded ? (
              <>
                {inviteData.familyGallery.paragraphs.map((paragraph, index) => (
                  <p className="font-body text-xl leading-relaxed sm:text-2xl" key={paragraph}>
                    {paragraph}
                    {index === inviteData.familyGallery.paragraphs.length - 1 && (
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
              <p className="font-body text-xl leading-relaxed sm:text-2xl">
                {inviteData.familyGallery.paragraphs[0]}...
                <button
                  className="ml-3 inline-flex font-heading text-[0.75rem] font-bold uppercase tracking-[0.25em] text-[var(--invite-gold)] transition-colors hover:text-[var(--invite-brown)]"
                  onClick={() => setIsExpanded(true)}
                  type="button"
                >
                  Ver mais
                </button>
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
