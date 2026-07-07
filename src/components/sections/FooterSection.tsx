import { Settings, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { inviteData } from "@/config/invite";

export function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#071324] to-[#0A1628] py-12 text-white/80">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="mb-3 font-script italic font-medium text-4xl text-[var(--invite-gold)] md:text-5xl">
          {inviteData.graduate.fullName}
        </h2>
        
        <p className="mx-auto mb-2 max-w-lg font-heading text-base italic leading-relaxed text-white/80 md:text-lg">
          {inviteData.graduate.signatureQuote}
        </p>
        <p className="mb-5 text-xs uppercase tracking-[0.2em] text-[var(--invite-gold)]">
          — {inviteData.graduate.firstName}
        </p>

        <Link
          to="/admin"
          className="mb-6 inline-flex items-center justify-center rounded-md border border-[var(--invite-gold)]/30 px-5 py-2 text-xs uppercase tracking-widest text-[var(--invite-gold)]/80 transition hover:border-[var(--invite-gold)] hover:bg-[var(--invite-gold)]/10"
        >
          <Settings className="mr-2 h-3.5 w-3.5" />
          {inviteData.footer.adminLabel}
        </Link>
        
        <div className="mb-4 h-px w-full bg-white/5" />
        
        <p className="mb-1 text-[0.62rem] uppercase tracking-[0.2em] text-white/30">
          Site desenvolvido por
        </p>
        <p className="mb-2 font-heading text-base tracking-[0.3em] text-white/50">
          LUMA
        </p>
        
        <a
          href="https://instagram.com/luma.convitesdigitais"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[0.65rem] text-white/30 transition-colors hover:text-[var(--invite-gold)]"
        >
          <Instagram className="h-3.5 w-3.5" /> @luma.convitesdigitais
        </a>
        
        <p className="mt-6 text-[0.6rem] text-white/10">
          © {currentYear} Formatura {inviteData.graduate.fullName}.
        </p>
      </div>
    </footer>
  );
}
