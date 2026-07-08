import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { inviteData } from "@/config/invite";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

const PREVIEW_PARAGRAPH_COUNT = 2;

export function FamilyGallerySection() {
  const [autoplay] = useState(() =>
    Autoplay({
      delay: 3600,
      stopOnInteraction: false,
    }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center", loop: true }, [autoplay]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Block page scroll when Lightbox is open
  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedImageIndex]);

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex === null) return;
    const slides = inviteData.familyGallery.slides;
    setSelectedImageIndex((prev) => (prev !== null ? (prev - 1 + slides.length) % slides.length : null));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex === null) return;
    const slides = inviteData.familyGallery.slides;
    setSelectedImageIndex((prev) => (prev !== null ? (prev + 1) % slides.length : null));
  };

  return (
    <section className="invite-section !pt-4 sm:!pt-8 !pb-4 sm:!pb-8 overflow-hidden" id="familia">
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
                {inviteData.familyGallery.slides.map((slide, index) => {
                  const isLandscape = slide.aspect === "landscape";
                  return (
                    <div
                      className={cn(
                        "min-w-0 pl-4 transition-all duration-300",
                        isLandscape
                          ? "flex-[0_0_95%] sm:flex-[0_0_90%] md:flex-[0_0_70%] lg:flex-[0_0_56%]"
                          : "flex-[0_0_75%] sm:flex-[0_0_45%] md:flex-[0_0_35%] lg:flex-[0_0_28%]"
                      )}
                      key={slide.asset}
                    >
                      <div
                        onClick={() => setSelectedImageIndex(index)}
                        className="group relative cursor-pointer overflow-hidden rounded-[24px] bg-white shadow-lg border border-[var(--invite-line)]/35"
                      >
                        <div className={cn("overflow-hidden", isLandscape ? "aspect-[3/2]" : "aspect-[3/4]")}>
                          <ResponsiveImage
                            asset={slide.asset}
                            alt={slide.alt}
                            className={cn(
                              "h-full w-full object-cover transition-transform duration-700 group-hover:scale-105",
                              slide.positionClass,
                            )}
                            sizes={
                              isLandscape
                                ? "(min-width: 1024px) 56vw, (min-width: 768px) 70vw, 95vw"
                                : "(min-width: 1024px) 28vw, (min-width: 768px) 35vw, 75vw"
                            }
                          />
                        </div>
                      
                      {/* Gradient Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                        <span className="text-white text-xs uppercase tracking-widest bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          Ampliar Foto 🔍
                        </span>
                      </div>
                    </div>
                    {slide.caption && (
                      <p className="mt-3 px-2 text-center font-body text-sm text-[var(--invite-brown-soft)]/80 italic">
                        {slide.caption}
                      </p>
                    )}
                  </div>
                );
              })}
              </div>
            </div>

            <button
              className="absolute left-2 top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--invite-gold)]/40 bg-[var(--invite-paper)] text-[var(--invite-brown)] shadow-lg md:inline-flex hover:bg-[var(--invite-gold)] hover:text-white transition-colors duration-300"
              onClick={() => emblaApi?.scrollPrev()}
              type="button"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              className="absolute right-2 top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--invite-gold)]/40 bg-[var(--invite-paper)] text-[var(--invite-brown)] shadow-lg md:inline-flex hover:bg-[var(--invite-gold)] hover:text-white transition-colors duration-300"
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
                  <p className="font-body text-base leading-relaxed sm:text-lg" key={paragraph}>
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
              <>
                {inviteData.familyGallery.paragraphs
                  .slice(0, PREVIEW_PARAGRAPH_COUNT)
                  .map((paragraph, index) => (
                    <p className="font-body text-base leading-relaxed sm:text-lg" key={paragraph}>
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
        </Reveal>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4"
            onClick={() => setSelectedImageIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 z-[160]"
              aria-label="Fechar visualizador"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Side Controls (Desktop Only) */}
            <button
              onClick={handlePrevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 z-[160] hidden md:block"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 z-[160] hidden md:block"
              aria-label="Próxima foto"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image display wrapper */}
            <div className="flex-1 flex items-center justify-center relative overflow-hidden w-full select-none">
              <motion.div
                key={`lightbox-${selectedImageIndex}`}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="max-w-[95%] max-h-[80vh] pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <ResponsiveImage
                  asset={inviteData.familyGallery.slides[selectedImageIndex].asset}
                  alt={inviteData.familyGallery.slides[selectedImageIndex].alt}
                  className="rounded-xl shadow-2xl max-h-[80vh] w-auto object-contain mx-auto"
                />
              </motion.div>
            </div>

            {/* Bottom Details */}
            <div className="text-center text-white/80 pb-6 font-sans">
              <p className="text-sm font-light mb-1 px-4 leading-relaxed">
                {inviteData.familyGallery.slides[selectedImageIndex].alt}
              </p>
              {inviteData.familyGallery.slides[selectedImageIndex].caption && (
                <p className="text-xs text-white/60 mb-2 italic">
                  {inviteData.familyGallery.slides[selectedImageIndex].caption}
                </p>
              )}
              <p className="text-xs text-white/40">
                {selectedImageIndex + 1} de {inviteData.familyGallery.slides.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
