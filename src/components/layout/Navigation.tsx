import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { inviteData } from "@/config/invite";
import { cn } from "@/lib/cn";
import { assetPath } from "@/config/assets";

function scrollToHash(hash: string) {
  const element = document.querySelector(hash);
  if (element instanceof HTMLElement) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

type BrandLogoVariant = "onDark" | "onLight";

function BrandLogo({
  className,
  variant,
}: {
  className?: string;
  variant: BrandLogoVariant;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center transition-all duration-500",
        className,
      )}
    >
      <img
        src={assetPath("images/logo.png")}
        alt="Logo Joana Darc"
        className="size-full object-contain"
        style={{
          filter: variant === "onDark" ? "brightness(0) invert(1)" : undefined,
        }}
      />
    </div>
  );
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
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-[var(--invite-line)] bg-white/95 backdrop-blur-lg py-3 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
            : "bg-transparent py-5 md:py-6",
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <button
            className="group relative z-[60] flex items-center gap-3 transition-transform hover:scale-[1.02]"
            onClick={() => scrollToHash("#inicio")}
            type="button"
          >
              <BrandLogo
                variant={scrolled ? "onLight" : "onDark"}
                className={scrolled ? "size-8" : "size-10 lg:size-11"}
              />
          </button>

          <nav className="hidden items-center gap-8 md:flex">
            {inviteData.navigation.map((item) => (
              <button
                key={item.href}
                className={cn(
                  "text-[0.68rem] font-medium uppercase tracking-[0.25em] transition-all duration-300",
                  scrolled
                    ? "text-[var(--invite-brown)] hover:text-[var(--invite-gold)] "
                    : "text-white/80 hover:text-white drop-shadow-sm",
                )}
                onClick={() => scrollToHash(item.href)}
                type="button"
              >
                {item.label}
              </button>
            ))}
            <button
              className={cn(
                "rounded-full border px-6 py-2.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] transition-all duration-300",
                scrolled
                  ? "border-[var(--invite-gold)] bg-[var(--invite-gold)]/5 text-[var(--invite-brown)] hover:bg-[var(--invite-gold)] hover:text-white"
                  : "border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20",
              )}
              onClick={() => scrollToHash("#rsvp")}
              type="button"
            >
              Confirmar
            </button>
          </nav>

          <div className="flex items-center md:hidden">
            <button
              className={cn(
                "relative z-[60] p-2 transition-colors",
                open ? "text-white" : scrolled ? "text-[var(--invite-brown)]" : "text-white drop-shadow-sm"
              )}
              onClick={() => setOpen((value) => !value)}
              type="button"
              aria-label="Abrir menu"
            >
              {open ? <X className="size-8" /> : <Menu className="size-8" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
             <motion.aside
              className="fixed inset-y-0 right-0 z-50 flex w-[85vw] max-w-[320px] flex-col overflow-y-auto bg-gradient-to-b from-[var(--invite-brown)] to-[#06101e] shadow-2xl md:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              {/* Close Button */}
              <button
                className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X className="size-5" />
              </button>

              <div className="border-b border-white/10 px-8 pb-6 pt-10 text-center flex flex-col items-center">
                <BrandLogo variant="onDark" className="size-20" />
                <div className="mt-4 flex items-center justify-center gap-3 text-white/40">
                  <span className="h-px w-6 bg-[var(--invite-gold)]/30" />
                  <span className="text-[0.65rem] uppercase tracking-[0.3em] text-[var(--invite-gold)]/80">
                    Menu
                  </span>
                  <span className="h-px w-6 bg-[var(--invite-gold)]/30" />
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-1 flex-col justify-center gap-1 px-8 py-4">
                {inviteData.navigation.map((item, index) => (
                  <motion.button
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="group flex items-center gap-4 rounded-lg px-4 py-3.5 text-left transition-colors hover:bg-white/5"
                    onClick={() => {
                      scrollToHash(item.href);
                      setOpen(false);
                    }}
                    type="button"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--invite-gold)]/30 transition-colors group-hover:bg-[var(--invite-gold)]" />
                    <span className="font-heading text-sm uppercase tracking-[0.2em] text-white/80 transition-colors group-hover:text-[var(--invite-gold)]">
                      {item.label}
                    </span>
                  </motion.button>
                ))}
              </nav>

              {/* Mobile Footer Actions */}
              <div className="border-t border-white/10 px-8 pb-6 pt-5">
                <button
                  className="w-full rounded-full bg-[var(--invite-gold)] py-3.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--invite-brown)] shadow-[0_0_20px_rgba(195,161,110,0.2)] transition-transform hover:scale-[1.02]"
                  onClick={() => {
                    scrollToHash("#rsvp");
                    setOpen(false);
                  }}
                  type="button"
                >
                  Confirmar Presença
                </button>
                <Link
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-[var(--invite-gold)]/30 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-[var(--invite-gold)] transition hover:bg-[var(--invite-gold)]/10"
                  onClick={() => setOpen(false)}
                  to="/admin"
                >
                  <GraduationCap className="size-4" />
                  Área Restrita
                </Link>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
