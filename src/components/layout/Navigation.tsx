import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { inviteData } from "@/config/invite";
import { cn } from "@/lib/cn";

function scrollToHash(hash: string) {
  const element = document.querySelector(hash);
  if (element instanceof HTMLElement) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition duration-300",
          scrolled
            ? "border-b border-white/10 bg-[#08120f]/84 backdrop-blur-xl"
            : "bg-transparent",
        )}
      >
        <div className="container-shell flex items-center justify-between py-4">
          <button
            className="group flex items-center gap-3"
            onClick={() => scrollToHash("#inicio")}
            type="button"
          >
            <div className="flex size-11 items-center justify-center rounded-full border border-[color:var(--color-gold)]/35 bg-white/[0.06] font-display text-lg text-[color:var(--color-gold-soft)]">
              {inviteData.hero.monogram}
            </div>
            <div className="text-left">
              <p className="font-script text-2xl leading-none text-[color:var(--color-paper)]">
                Camilla
              </p>
              <p className="mt-1 text-[0.62rem] uppercase tracking-[0.34em] text-white/55">
                Formatura em Medicina
              </p>
            </div>
          </button>

          <nav className="hidden items-center gap-6 lg:flex">
            {inviteData.navigation.map((item) => (
              <button
                key={item.href}
                className="text-xs uppercase tracking-[0.24em] text-white/68 transition hover:text-[color:var(--color-paper)]"
                onClick={() => scrollToHash(item.href)}
                type="button"
              >
                {item.label}
              </button>
            ))}
            <button
              className="button-secondary min-h-10 px-5 py-2 text-[0.7rem]"
              onClick={() => scrollToHash("#rsvp")}
              type="button"
            >
              Confirmar
            </button>
          </nav>

          <button
            className="inline-flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] lg:hidden"
            onClick={() => setOpen((value) => !value)}
            type="button"
            aria-label="Abrir menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/55 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="safe-bottom fixed inset-y-0 right-0 z-50 flex w-[82vw] max-w-sm flex-col border-l border-white/10 bg-[#091411]/96 px-6 pb-6 pt-[max(2rem,env(safe-area-inset-top))] backdrop-blur-2xl lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-script text-3xl text-[color:var(--color-paper)]">
                    Camilla
                  </p>
                  <p className="mt-1 text-[0.65rem] uppercase tracking-[0.34em] text-white/55">
                    Santana Conegundes
                  </p>
                </div>
                <button
                  className="inline-flex size-11 items-center justify-center rounded-full border border-white/10"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="glass-line my-8" />

              <div className="flex flex-col gap-2">
                {inviteData.navigation.map((item) => (
                  <button
                    key={item.href}
                    className="flex min-h-13 items-center justify-between rounded-2xl border border-white/8 bg-white/[0.04] px-4 text-left text-sm uppercase tracking-[0.18em] text-white/74"
                    onClick={() => {
                      scrollToHash(item.href);
                      setOpen(false);
                    }}
                    type="button"
                  >
                    {item.label}
                    <span className="text-[color:var(--color-gold-soft)]">/</span>
                  </button>
                ))}
              </div>

              <div className="mt-auto pt-8">
                <button
                  className="button-primary flex w-full"
                  onClick={() => {
                    scrollToHash("#rsvp");
                    setOpen(false);
                  }}
                  type="button"
                >
                  Confirmar presença
                </button>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
