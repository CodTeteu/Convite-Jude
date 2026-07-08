import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assetPath } from "@/config/assets";

export function LoadingIntro() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      // Minimum display time to appreciate the animation, then fade out
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      // Fallback timeout in case window load event is delayed
      const fallback = setTimeout(handleLoad, 4000);
      return () => {
        window.removeEventListener("load", handleLoad);
        clearTimeout(fallback);
      };
    }
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-[#0D2747] to-[#05101E]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <motion.div
            className="flex flex-col items-center gap-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Logo Image */}
            <div className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center">
              <img
                src={assetPath("images/logo.png")}
                alt="Logo Joana Darc"
                className="size-full object-contain brightness-0 invert"
              />
            </div>

            {/* Subtext */}
            <div className="flex flex-col items-center gap-1.5 text-center">
              <motion.span
                className="text-[0.65rem] tracking-[0.4em] uppercase text-[var(--invite-gold)] font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Joana Darc
              </motion.span>
              <motion.span
                className="text-[0.55rem] tracking-[0.25em] uppercase text-white/40"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Psicologia
              </motion.span>
            </div>

            {/* Shimmer loading bar */}
            <div className="relative mt-4 h-[2px] w-28 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="absolute top-0 h-full bg-gradient-to-r from-transparent via-[var(--invite-gold)] to-transparent"
                initial={{ left: "-100%", width: "100%" }}
                animate={{ left: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8,
                  ease: "easeInOut",
                }}
                style={{ width: "80%" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
