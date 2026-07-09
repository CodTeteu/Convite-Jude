import { useEffect, useRef } from "react";
import { Navigation } from "@/components/layout/Navigation";
import { CelebrationSection } from "@/components/sections/CelebrationSection";
import { FamilyGallerySection } from "@/components/sections/FamilyGallerySection";
import { FooterSection } from "@/components/sections/FooterSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { RSVPSection } from "@/components/sections/RSVPSection";
import { StorySection } from "@/components/sections/StorySection";
import { QuickActionsSection } from "@/components/sections/QuickActionsSection";
import { GiftListCalloutSection } from "@/components/sections/GiftListCalloutSection";
import { syncPendingSubmissions, getPendingCount } from "@/lib/pending-rsvp";
import { toast } from "sonner";

export default function HomePage() {
  const synced = useRef(false);

  useEffect(() => {
    if (synced.current) return;
    synced.current = true;

    const count = getPendingCount();
    if (count === 0) return;

    syncPendingSubmissions().then((result) => {
      if (result.synced > 0) {
        toast.success(
          `${result.synced} confirmação(ões) pendente(s) foram enviadas com sucesso!`,
        );
      }
    });
  }, []);

  return (
    <div className="invite-page">
      <Navigation />
      <main>
        <HeroSection />
        <div className="invite-texture-surface">
          <QuickActionsSection />
          <StorySection />
          <FamilyGallerySection />
          <CelebrationSection />
          <GiftListCalloutSection />
          <RSVPSection />
        </div>
      </main>
      <FooterSection />
    </div>
  );
}
