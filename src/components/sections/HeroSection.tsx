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
      className="relative flex h-[100svh] min-h-[600px] items-center justify-center overflow-hidden bg-[#2b2018] sm:h-screen sm:min-h-screen"
      id="inicio"
    >
      <motion.div
        animate={{ scale: [1, 1.03, 1] }}
        className="absolute inset-0 z-0 hidden sm:block"
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      >
        <ResponsiveImage
          asset={inviteData.hero.imageAsset}
          alt="Camilla Santana Conegundes em retrato principal de formatura"
          className="h-full w-full object-cover object-[center_20%]"
          eager
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/42 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.4),rgba(0,0,0,0.08)_38%,rgba(0,0,0,0.72)_100%)]" />
      </motion.div>

      {/* Mobile Fixed Background (No-scale to prevent zoom bugs) */}
      <div className="absolute inset-0 z-0 sm:hidden">
        <ResponsiveImage
          asset={inviteData.hero.imageAsset}
          alt="Camilla Santana Conegundes"
          className="h-full w-full object-cover object-[center_22%]"
          eager
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/45 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/80" />
      </div>

      <motion.div
        className="relative z-10 flex h-full w-full flex-col items-center px-4 pb-28 pt-18 text-center sm:px-6 sm:pb-32 sm:pt-20 md:pb-24"
        initial={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col items-center gap-4 sm:gap-5">
          <div className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-6 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.4em] text-white/90 shadow-lg backdrop-blur-sm sm:px-7 sm:text-[0.68rem]">
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
          <div className="grid grid-cols-4 gap-2 text-white sm:gap-3">
            {countdownItems.map((item, index) => (
              <motion.div
                key={item.key}
                className={cn(
                  "flex min-w-[62px] flex-col items-center rounded-[18px] border border-white/18 bg-black/45 px-2.5 py-3.5 backdrop-blur-sm shadow-lg",
                  "transition duration-300 sm:min-w-[78px] sm:px-4 sm:py-4.5",
                )}
                initial={{ opacity: 0, y: 24 }}
                transition={{ delay: 0.12 + index * 0.06, duration: 0.55 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <span className="font-heading text-2xl leading-none text-white sm:text-3xl">
                  {String(countdown[item.key]).padStart(2, "0")}
                </span>
                <span className="mt-2 text-[0.55rem] uppercase tracking-[0.16em] text-white/60 sm:text-[0.6rem] sm:tracking-[0.14em]">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>

          <button
            className="group inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full border border-white/25 bg-white/8 px-7 py-2 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/15 sm:px-9"
            onClick={() =>
              document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" })
            }
            type="button"
          >
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] sm:text-[0.7rem] sm:tracking-[0.28em]">
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
