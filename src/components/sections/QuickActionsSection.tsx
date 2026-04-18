import { motion } from "framer-motion";
import { MapPin, CheckCircle, BookOpen, Users } from "lucide-react";

export function QuickActionsSection() {
  return (
    <section className="relative z-20 px-4 pb-8 pt-16 sm:px-6 md:pb-12 md:pt-24" id="acoes-rapidas">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <button
            onClick={() => document.getElementById("jornada")?.scrollIntoView({ behavior: "smooth" })}
            className="invite-card group flex flex-col items-center gap-3 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(10,28,20,0.12)] sm:p-7"
          >
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[var(--invite-brown)] text-[var(--invite-cream)] transition-transform duration-300 group-hover:scale-110">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="text-center">
              <h3 className="font-heading text-lg sm:text-xl text-[var(--invite-brown)]">
                Jornada
              </h3>
              <p className="mt-1 text-[0.65rem] sm:text-xs uppercase tracking-[0.12em] text-[var(--invite-brown-soft)]">
                Minha história
              </p>
            </div>
          </button>

          <button
            onClick={() => document.getElementById("familia")?.scrollIntoView({ behavior: "smooth" })}
            className="invite-card group flex flex-col items-center gap-3 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(10,28,20,0.12)] sm:p-7"
          >
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[var(--invite-brown)] text-[var(--invite-cream)] transition-transform duration-300 group-hover:scale-110">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="text-center">
              <h3 className="font-heading text-lg sm:text-xl text-[var(--invite-brown)]">
                Família
              </h3>
              <p className="mt-1 text-[0.65rem] sm:text-xs uppercase tracking-[0.12em] text-[var(--invite-brown-soft)]">
                A base de tudo
              </p>
            </div>
          </button>

          <button
            onClick={() => document.getElementById("celebracao")?.scrollIntoView({ behavior: "smooth" })}
            className="invite-card group flex flex-col items-center gap-3 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(10,28,20,0.12)] sm:p-7"
          >
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[var(--invite-brown)] text-[var(--invite-cream)] transition-transform duration-300 group-hover:scale-110">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="text-center">
              <h3 className="font-heading text-lg sm:text-xl text-[var(--invite-brown)]">
                Evento
              </h3>
              <p className="mt-1 text-[0.65rem] sm:text-xs uppercase tracking-[0.12em] text-[var(--invite-brown-soft)]">
                Localização
              </p>
            </div>
          </button>

          <button
            onClick={() => document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" })}
            className="invite-card group flex flex-col items-center gap-3 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(10,28,20,0.12)] sm:p-7"
          >
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[var(--invite-brown)] text-[var(--invite-cream)] transition-transform duration-300 group-hover:scale-110">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="text-center">
              <h3 className="font-heading text-lg sm:text-xl text-[var(--invite-brown)]">
                Presença
              </h3>
              <p className="mt-1 text-[0.65rem] sm:text-xs uppercase tracking-[0.12em] text-[var(--invite-brown-soft)]">
                Até 17/07
              </p>
            </div>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
