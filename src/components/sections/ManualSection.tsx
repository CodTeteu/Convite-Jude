import { inviteData } from "@/config/invite";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ManualSection() {
  return (
    <section className="section-shell">
      <SectionHeading
        label={inviteData.manual.label}
        title={inviteData.manual.title}
        description="Uma leitura rápida para que você viva esta noite com tranquilidade, elegância e conforto."
        align="center"
      />

      <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {inviteData.manual.items.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.05}>
            <article className="card-luxe h-full px-6 py-6">
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[color:var(--color-gold-soft)]/72">
                Orientação {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 text-2xl text-[color:var(--color-paper)]">
                {item.title}
              </h3>
              <p className="mt-4 text-base leading-8 text-white/68">
                {item.description}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
