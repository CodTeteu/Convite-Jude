import { CalendarDays, Clock3, MapPin, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { inviteData } from "@/config/invite";
import { buildGoogleCalendarUrl } from "@/lib/calendar";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { Reveal } from "@/components/ui/Reveal";

function HeroImageCard({ compact = false }: { compact?: boolean }) {
  return (
    <motion.div
      animate={compact ? undefined : { y: [0, -10, 0] }}
      transition={compact ? undefined : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="relative mx-auto w-full max-w-md"
    >
      <div className="absolute -left-10 top-8 h-28 w-28 rounded-full bg-[radial-gradient(circle,_rgba(195,164,107,0.34),_transparent_70%)] blur-2xl" />
      <div className="absolute -bottom-10 right-2 h-36 w-36 rounded-full bg-[radial-gradient(circle,_rgba(27,58,49,0.55),_transparent_75%)] blur-3xl" />

      <div className={`ornate-frame ${compact ? "aspect-[0.9]" : "aspect-[0.78]"}`}>
        <ResponsiveImage
          asset={inviteData.hero.imageAsset}
          alt="Camilla Santana Conegundes em retrato principal de formatura"
          eager={compact}
          sizes={compact ? "92vw" : "(min-width: 1024px) 40vw, 92vw"}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,16,14,0.06),rgba(7,16,14,0.46)_75%,rgba(7,16,14,0.82)_100%)]" />
      </div>

      <div
        className={`card-luxe absolute grid grid-cols-3 gap-2 px-3 py-3 backdrop-blur-2xl ${
          compact ? "-bottom-5 left-3 right-3" : "-bottom-6 left-4 right-4 sm:left-6 sm:right-6"
        }`}
      >
        <div className="rounded-2xl border border-white/8 bg-black/10 px-3 py-3 text-center">
          <CalendarDays className="mx-auto mb-2 size-4 text-[color:var(--color-gold-soft)]" />
          <p className="text-[0.58rem] uppercase tracking-[0.22em] text-white/55">Data</p>
          <p className="mt-1 text-sm text-[color:var(--color-paper)]">{inviteData.event.dateText}</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-black/10 px-3 py-3 text-center">
          <Clock3 className="mx-auto mb-2 size-4 text-[color:var(--color-gold-soft)]" />
          <p className="text-[0.58rem] uppercase tracking-[0.22em] text-white/55">Hora</p>
          <p className="mt-1 text-sm text-[color:var(--color-paper)]">{inviteData.event.timeText}</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-black/10 px-3 py-3 text-center">
          <MapPin className="mx-auto mb-2 size-4 text-[color:var(--color-gold-soft)]" />
          <p className="text-[0.58rem] uppercase tracking-[0.22em] text-white/55">Local</p>
          <p className="mt-1 text-sm text-[color:var(--color-paper)]">{inviteData.event.venueName}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="container-shell relative flex min-h-[100svh] items-center pt-28 pb-16 sm:pt-32 sm:pb-20"
    >
      <div className="grid w-full items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative z-10">
          <Reveal>
            <p className="section-label">{inviteData.hero.eyebrow}</p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-gold)]/20 bg-white/[0.05] px-4 py-2 text-[0.72rem] uppercase tracking-[0.24em] text-white/65">
              <Sparkles className="size-4 text-[color:var(--color-gold-soft)]" />
              {inviteData.hero.overline}
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-8 text-shadow-soft">
              <span className="block font-script text-6xl leading-none text-[color:var(--color-paper)] sm:text-7xl">
                {inviteData.graduate.firstName}
              </span>
              <span className="mt-3 block max-w-xl text-3xl font-semibold uppercase tracking-[0.24em] text-[color:var(--color-gold-soft)] sm:text-4xl">
                {inviteData.graduate.lastName}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/70">
                {inviteData.graduate.course}
              </span>
              <span className="inline-flex items-center rounded-full border border-[color:var(--color-gold)]/18 bg-[color:var(--color-gold)]/[0.09] px-4 py-2 text-xs uppercase tracking-[0.25em] text-[color:var(--color-gold-soft)]">
                {inviteData.event.label}
              </span>
            </div>
          </Reveal>

          <Reveal className="mt-10 lg:hidden" delay={0.18}>
            <HeroImageCard compact />
          </Reveal>

          <Reveal delay={0.2}>
            <blockquote className="mt-16 max-w-2xl border-l border-[color:var(--color-gold)]/35 pl-5 text-lg leading-8 text-white/78 sm:mt-8 sm:text-xl">
              “{inviteData.graduate.signatureQuote}”
            </blockquote>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="mt-8 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              {inviteData.hero.intro}
            </p>
          </Reveal>

          <Reveal delay={0.28}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button
                className="button-primary"
                onClick={() =>
                  document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" })
                }
                type="button"
              >
                {inviteData.hero.primaryCta}
              </button>
              <a className="button-secondary" href={inviteData.event.mapsUrl} target="_blank" rel="noreferrer">
                {inviteData.hero.secondaryCta}
              </a>
              <a className="button-ghost" href={buildGoogleCalendarUrl()} target="_blank" rel="noreferrer">
                {inviteData.hero.tertiaryCta}
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal className="relative hidden lg:block" delay={0.15}>
          <HeroImageCard />
        </Reveal>
      </div>
    </section>
  );
}
