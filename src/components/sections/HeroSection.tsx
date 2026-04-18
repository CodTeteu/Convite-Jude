import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { inviteData } from "@/config/invite";
import { useCountdown } from "@/hooks/useCountdown";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { cn } from "@/lib/cn";

const countdownItems = [
  { key: "days", label: "Dias" },
  { key: "hours", label: "Horas" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Seg" },
] as const;

export function HeroSection() {
  const countdown = useCountdown(inviteData.event.startsAt);

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#2b2018]"
      id="inicio"
    >
      <motion.div
        animate={{ scale: [1, 1.03, 1] }}
        className="absolute inset-0 z-0"
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      >
        <ResponsiveImage
          asset={inviteData.hero.imageAsset}
          alt="Camilla Santana Conegundes em retrato principal de formatura"
          className="h-full w-full object-cover object-[center_28%] sm:object-[center_24%] md:object-[center_20%]"
          eager
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/42 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.4),rgba(0,0,0,0.08)_38%,rgba(0,0,0,0.72)_100%)]" />
      </motion.div>

      <motion.div
        className="relative z-10 flex min-h-screen w-full flex-col items-center px-4 pb-12 pt-24 text-center sm:px-6 sm:pb-10 sm:pt-28 md:pb-8"
        initial={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col items-center gap-4 sm:gap-5">
          <div className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/6 px-7 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.36em] text-white/92 shadow-lg backdrop-blur-sm sm:px-9 sm:text-xs">
            {inviteData.hero.eyebrow}
          </div>

          <div className="mt-2 flex flex-col items-center">
            <h1 className="font-script text-[4rem] leading-none text-[#fff8e7] drop-shadow-lg sm:text-[4.8rem] md:text-[7.5rem]">
              {inviteData.hero.name}
            </h1>
            <p className="mt-3 text-[0.9rem] uppercase tracking-[0.28em] text-white/80 sm:mt-4 sm:text-lg">
              {inviteData.hero.courseLine}
            </p>
          </div>
        </div>

        <div className="mt-auto flex flex-col items-center gap-5 pb-0 sm:gap-6">
          <div className="grid grid-cols-4 gap-2.5 text-white sm:gap-3.5">
            {countdownItems.map((item, index) => (
              <motion.div
                key={item.key}
                className={cn(
                  "flex min-w-[68px] flex-col items-center rounded-[20px] border border-white/20 bg-black/45 px-3 py-3.5 backdrop-blur-sm shadow-lg",
                  "transition duration-300 sm:min-w-[82px] sm:px-4 sm:py-4.5",
                )}
                initial={{ opacity: 0, y: 24 }}
                transition={{ delay: 0.12 + index * 0.06, duration: 0.55 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <span className="font-heading text-3xl leading-none text-white sm:text-4xl">
                  {String(countdown[item.key]).padStart(2, "0")}
                </span>
                <span className="mt-2 text-[0.6rem] uppercase tracking-[0.18em] text-white/70 sm:text-[0.65rem] sm:tracking-[0.16em]">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>

          <button
            className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/30 bg-white/10 px-8 py-2.5 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/18 sm:px-10"
            onClick={() =>
              document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" })
            }
            type="button"
          >
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] sm:text-[0.72rem] sm:tracking-[0.32em]">
              {inviteData.hero.primaryCta}
            </span>
            <span className="text-base transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </motion.div>

      <motion.button
        animate={{ y: [0, 10, 0] }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/72"
        onClick={() =>
          document.getElementById("jornada")?.scrollIntoView({ behavior: "smooth" })
        }
        transition={{ repeat: Infinity, duration: 2 }}
        type="button"
      >
        <ChevronDown className="size-8" />
      </motion.button>
    </section>
  );
}
