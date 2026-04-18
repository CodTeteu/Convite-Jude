import { HeartHandshake } from "lucide-react";
import { inviteData } from "@/config/invite";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function StorySection() {
  return (
    <section className="section-shell" id="jornada">
      <SectionHeading
        label={inviteData.editorial.label}
        title={inviteData.editorial.title}
        description={inviteData.editorial.lead}
      />

      <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          {inviteData.editorial.paragraphs.map((paragraph, index) => (
            <Reveal
              key={paragraph.slice(0, 18)}
              className="card-luxe px-6 py-6 sm:px-7"
              delay={0.05 * index}
            >
              <p className="text-base leading-8 text-white/74 sm:text-lg">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>

        <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <Reveal className="panel-luxe overflow-hidden">
            <div className="relative aspect-square">
              <ResponsiveImage
                asset={inviteData.editorial.childhoodMemory.imageAsset}
                alt="Camilla na infância"
                sizes="(min-width: 1024px) 30vw, 90vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,16,14,0.15),rgba(7,16,14,0.75))]" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-[0.68rem] uppercase tracking-[0.3em] text-[color:var(--color-gold-soft)]/70">
                  Memória afetiva
                </p>
                <p className="mt-3 max-w-sm text-base leading-7 text-white/82">
                  {inviteData.editorial.childhoodMemory.caption}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal className="card-luxe px-6 py-7 sm:px-7">
            <div className="flex items-center gap-3 text-[color:var(--color-gold-soft)]">
              <HeartHandshake className="size-5" />
              <p className="text-[0.7rem] uppercase tracking-[0.28em]">
                Medicina com humanidade
              </p>
            </div>
            <p className="mt-5 text-2xl leading-tight text-[color:var(--color-paper)]">
              “Quero deixar essa marca por onde eu passar.”
            </p>
            <p className="mt-4 text-base leading-8 text-white/68">
              Entre ciência e compaixão, Camilla construiu uma trajetória profundamente
              humana. Este convite celebra também essa forma sensível de cuidar.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
