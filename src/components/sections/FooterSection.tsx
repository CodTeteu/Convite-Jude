import { inviteData } from "@/config/invite";

export function FooterSection() {
  return (
    <footer className="container-shell pb-24 pt-8 sm:pb-16">
      <div className="glass-line mb-8" />
      <div className="flex flex-col gap-6 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
        <div>
          <p className="font-script text-4xl text-[color:var(--color-paper)]">Camilla</p>
          <p className="mt-2 max-w-xl text-base leading-7 text-white/64">
            {inviteData.footer.closing}
          </p>
        </div>
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[color:var(--color-gold-soft)]/70">
            {inviteData.footer.brand}
          </p>
          <p className="mt-2 text-sm text-white/50">
            Convite digital com direção visual editorial e experiência pensada para mobile.
          </p>
        </div>
      </div>
    </footer>
  );
}
