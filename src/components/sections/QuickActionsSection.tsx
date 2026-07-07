import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPin, CheckCircle, BookOpen, Gift, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { inviteData } from "@/config/invite";

interface ActionItem {
  id: string;
  label: string;
  subtitle: string;
  icon: LucideIcon;
  onClick: () => void;
}

export function QuickActionsSection() {
  const navigate = useNavigate();
  const confirmationDeadlineShort = inviteData.event.confirmationDeadline.slice(0, 5);
  const giftsEnabled = inviteData.features.giftList && inviteData.giftList.enabled;

  const actions: ActionItem[] = [
    {
      id: "jornada",
      label: "Jornada",
      subtitle: "História",
      icon: BookOpen,
      onClick: () => document.getElementById("jornada")?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      id: "familia",
      label: "Família",
      subtitle: "Base",
      icon: Users,
      onClick: () => document.getElementById("familia")?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      id: "celebracao",
      label: "Evento",
      subtitle: "Info",
      icon: MapPin,
      onClick: () => document.getElementById("celebracao")?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      id: "rsvp",
      label: "Confirmar",
      subtitle: `Até ${confirmationDeadlineShort}`,
      icon: CheckCircle,
      onClick: () => document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" }),
    },
  ];

  if (giftsEnabled) {
    actions.push({
      id: "presentes",
      label: "Presentes",
      subtitle: "Lista",
      icon: Gift,
      onClick: () => navigate("/presentes"),
    });
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 18,
      }
    },
  };

  return (
    <section className="relative z-20 px-4 py-6 sm:px-6 sm:py-8" id="acoes-rapidas">
      <div className="mx-auto max-w-3xl">
        <motion.div
          className="grid grid-cols-4 gap-2 sm:gap-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-20px" }}
        >
          {actions.map((action) => {
            const Icon = action.icon;
            // Balance the layout on mobile (3 columns) if there are 5 items
            // Items 4 & 5 will take colspan 1, but we can center the last row or make them sit cleanly.
            // On a 3-column grid, if we have 5 items:
            // Row 1: [1] [2] [3]
            // Row 2: [4] [5] (blank space at end)
            // To make it look extremely balanced, we can make the 4th and 5th item take col-span-1.5, or just let them sit nicely.
            // On md screen and up, it will be 5 columns: grid-cols-5, so it's a single clean row.
            
            return (
              <motion.button
                key={action.id}
                onClick={action.onClick}
                variants={itemVariants}
                className="group relative flex flex-col items-center justify-center p-2 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97]"
              >
                {/* Compact icon container */}
                <div className="relative mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--invite-brown)] text-[var(--invite-gold)] shadow-sm transition-all duration-300 group-hover:scale-105">
                  <div className="absolute inset-[-3px] rounded-full border border-[var(--invite-gold)]/20 scale-95 transition-all duration-300 group-hover:scale-105" />
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </div>

                {/* Compact typography */}
                <div className="text-center">
                  <h3 className="font-heading text-xs font-semibold text-[var(--invite-brown)] tracking-wide">
                    {action.label}
                  </h3>
                  <p className="mt-0.5 text-[0.55rem] font-sans font-bold uppercase tracking-[0.15em] text-[var(--invite-gold-deep)]">
                    {action.subtitle}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
