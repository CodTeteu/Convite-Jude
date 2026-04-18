import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { inviteData } from "@/config/invite";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function GallerySection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedPhoto =
    selectedIndex !== null ? inviteData.gallery.photos[selectedIndex] : null;

  return (
    <section className="section-shell" id="galeria">
      <SectionHeading
        label={inviteData.gallery.label}
        title={inviteData.gallery.title}
        description={inviteData.gallery.description}
        align="center"
      />

      <div className="mt-14 columns-2 gap-4 sm:columns-3">
        {inviteData.gallery.photos.map((photo, index) => (
          <Reveal key={photo.asset} className="mb-4 break-inside-avoid" delay={index * 0.03}>
            <button
              className="ornate-frame group relative w-full overflow-hidden"
              onClick={() => setSelectedIndex(index)}
              type="button"
            >
              <ResponsiveImage
                asset={photo.asset}
                alt={photo.alt}
                className="transition duration-500 group-hover:scale-[1.03]"
                sizes="(min-width: 640px) 33vw, 50vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(7,16,14,0.6))] opacity-0 transition duration-300 group-hover:opacity-100" />
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {selectedPhoto ? (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/84 p-4 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className="absolute right-4 top-4 inline-flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/5"
              onClick={() => setSelectedIndex(null)}
              type="button"
            >
              <X className="size-5" />
            </button>

            <button
              className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/10 bg-white/5 p-3 md:inline-flex"
              onClick={() =>
                setSelectedIndex((value) =>
                  value === null
                    ? 0
                    : (value - 1 + inviteData.gallery.photos.length) %
                      inviteData.gallery.photos.length,
                )
              }
              type="button"
            >
              <ChevronLeft className="size-5" />
            </button>

            <div className="max-h-[88vh] w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a1512]">
              <ResponsiveImage
                asset={selectedPhoto.asset}
                alt={selectedPhoto.alt}
                className="max-h-[78vh] w-full object-contain bg-[#08120f]"
                sizes="90vw"
                eager
              />
              <div className="flex items-center justify-between gap-4 px-5 py-4 text-sm text-white/70">
                <p>{selectedPhoto.alt}</p>
                <p className="min-w-fit text-[0.7rem] uppercase tracking-[0.22em] text-[color:var(--color-gold-soft)]/70">
                  {selectedIndex! + 1}/{inviteData.gallery.photos.length}
                </p>
              </div>
            </div>

            <button
              className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/10 bg-white/5 p-3 md:inline-flex"
              onClick={() =>
                setSelectedIndex((value) =>
                  value === null
                    ? 0
                    : (value + 1) % inviteData.gallery.photos.length,
                )
              }
              type="button"
            >
              <ChevronRight className="size-5" />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
