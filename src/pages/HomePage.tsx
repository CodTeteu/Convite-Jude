import { Navigation } from "@/components/layout/Navigation";
import { CelebrationSection } from "@/components/sections/CelebrationSection";
import { FamilyGallerySection } from "@/components/sections/FamilyGallerySection";
import { FooterSection } from "@/components/sections/FooterSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { RSVPSection } from "@/components/sections/RSVPSection";
import { StorySection } from "@/components/sections/StorySection";
import { QuickActionsSection } from "@/components/sections/QuickActionsSection";

export default function HomePage() {
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
          <RSVPSection />
        </div>
      </main>
      <FooterSection />
    </div>
  );
}
