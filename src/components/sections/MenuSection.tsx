import { UtensilsCrossed } from "lucide-react";
import { inviteData } from "@/config/invite";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const categoryIcons: Record<string, string> = {
  Entrada: "🍢",
  "Prato Principal": "🥩",
  Sobremesa: "🍰",
};

export function MenuSection() {
  if (!inviteData.menu?.enabled) return null;

  return (
    <section className="invite-section !pb-6 !pt-2 sm:!pb-10 sm:!pt-4" id="cardapio">
      <div className="invite-container">
        <SectionHeading
          align="center"
          label={inviteData.menu.label}
          title={inviteData.menu.title}
        />

        <Reveal className="invite-card-strong mx-auto mt-10 max-w-2xl overflow-hidden" delay={0.06}>
          <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-[var(--invite-sage-soft)]/30 via-transparent to-[var(--invite-sage-soft)]/30 px-6 py-5">
            <UtensilsCrossed className="size-5 text-[var(--invite-gold)]" strokeWidth={1.6} />
            <p className="font-body text-lg text-[var(--invite-brown-soft)] sm:text-xl">
              {inviteData.menu.description}
            </p>
          </div>

          <div className="divide-y divide-[var(--invite-line)] px-6 py-4 sm:px-8">
            {inviteData.menu.courses.map((course, index) => (
              <Reveal
                className="py-5 first:pt-3 last:pb-3"
                delay={0.08 + index * 0.06}
                key={course.category}
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-xl" role="img" aria-label={course.category}>
                    {categoryIcons[course.category] ?? "🍽️"}
                  </span>
                  <p className="font-heading text-sm uppercase tracking-[0.3em] text-[var(--invite-sage)]">
                    {course.category}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pl-9">
                  {course.items.map((item) => (
                    <span
                      className="rounded-full border border-[var(--invite-line)] bg-[var(--invite-sage-soft)]/20 px-4 py-1.5 font-body text-base text-[var(--invite-brown)] sm:text-lg"
                      key={item}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
