import { inviteData } from "@/config/invite";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function FamilySection() {
  return (
    <section className="section-shell" id="familia">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="space-y-4">
          <SectionHeading
            label={inviteData.family.label}
            title={inviteData.family.title}
            description={inviteData.family.text}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {inviteData.family.photos.map((photo, index) => (
            <Reveal
              key={photo.asset}
              className={index === 1 ? "sm:col-span-2" : undefined}
              delay={index * 0.08}
            >
              <figure className="ornate-frame group h-full">
                <div className={index === 1 ? "aspect-[1.45]" : "aspect-[0.84]"}>
                  <ResponsiveImage
                    asset={photo.asset}
                    alt={photo.alt}
                    className="transition duration-500 group-hover:scale-[1.03]"
                    sizes="(min-width: 640px) 50vw, 100vw"
                  />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(7,16,14,0.86))] px-5 py-5">
                  <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[color:var(--color-gold-soft)]/70">
                    Família
                  </p>
                  <p className="mt-2 text-base text-[color:var(--color-paper)]">
                    {photo.caption}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
