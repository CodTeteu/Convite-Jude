import { useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { inviteData } from "@/config/invite";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { Reveal } from "@/components/ui/Reveal";

export function StorySection() {
  const [autoplay] = useState(() =>
    Autoplay({
      delay: 4500,
      stopOnInteraction: false,
    }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" }, [autoplay]);

  return (
    <section className="invite-section" id="jornada">
      <div className="invite-container">
        <div className="text-center lg:hidden">
          <p className="font-heading text-[0.72rem] uppercase tracking-[0.32em] text-[var(--invite-gold)]">
            {inviteData.journey.label}
          </p>
          <h2 className="mt-4 font-script text-5xl text-[var(--invite-brown)] sm:text-6xl">
            {inviteData.journey.title}
          </h2>
        </div>

        <div className="mt-10 grid items-center gap-14 lg:mt-0 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <Reveal className="relative">
            <div className="relative overflow-hidden rounded-[34px] border border-[#dbc9ad] bg-[var(--invite-paper)] shadow-[0_28px_70px_rgba(63,46,29,0.12)]">
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
              <p className="font-heading text-[0.72rem] uppercase tracking-[0.32em] text-[var(--invite-gold)]">
                {inviteData.journey.label}
              </p>
              <h2 className="mt-4 font-script text-6xl text-[var(--invite-brown)]">
                {inviteData.journey.title}
              </h2>
            </div>

            <div className="invite-card px-6 py-7 sm:px-10 sm:py-10 text-center lg:text-left shadow-[0_20px_60px_rgba(10,28,20,0.06)] bg-white/60 backdrop-blur-sm border-white/20">
              <div className="space-y-6 text-[var(--invite-brown-soft)]">
                {inviteData.journey.paragraphs.map((paragraph) => (
                  <p className="font-body text-xl leading-relaxed sm:text-[1.38rem] lg:leading-loose" key={paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="border-l-2 border-[var(--invite-line)]/45 pl-6 text-left italic text-[var(--invite-brown)]">
              <p className="font-heading text-2xl leading-relaxed sm:text-3xl">
                “{inviteData.journey.quote}”
              </p>
              <span className="mt-3 block font-sans text-[0.7rem] uppercase tracking-[0.24em] text-[var(--invite-gold)]">
                {inviteData.journey.quoteAuthor}
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
