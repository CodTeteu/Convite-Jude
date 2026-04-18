import { useEffect, useState } from "react";

export function MobileStickyCta() {
  const [hidden, setHidden] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const target = document.getElementById("rsvp");

    if (!target) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHidden(entry.isIntersecting);
      },
      { threshold: 0.25 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setEnabled(window.scrollY > 320);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (hidden || !enabled) {
    return null;
  }

  return (
    <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 px-4 pb-4 lg:hidden">
      <div className="panel-luxe flex items-center gap-4 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="text-[0.65rem] uppercase tracking-[0.32em] text-[color:var(--color-gold-soft)]/70">
            RSVP
          </p>
          <p className="mt-1 truncate text-sm text-white/82">
            Confirme sua presença até 17/07/2026
          </p>
        </div>
        <button
          className="button-primary min-h-11 px-5 py-2 text-[0.68rem]"
          onClick={() => {
            document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" });
          }}
          type="button"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}
