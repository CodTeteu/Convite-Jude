import { Link } from "react-router-dom";
import { inviteData } from "@/config/invite";
import { Reveal } from "@/components/ui/Reveal";

export function GiftListCalloutSection() {
  if (!inviteData.features.giftList || !inviteData.giftList.enabled) return null;

  return (
    <section className="invite-section" id="presentes">
      <div className="invite-container">
        <Reveal className="invite-card-strong p-8 text-center">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-[var(--invite-sage)]">
            Presentes
          </p>
          <h2 className="mt-3 font-heading text-4xl text-[var(--invite-brown)]">
            {inviteData.giftList.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--invite-brown-soft)]">
            {inviteData.giftList.description}
          </p>
          <Link className="invite-button-primary mt-6 inline-flex" to="/presentes">
            Ver lista de presentes
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
