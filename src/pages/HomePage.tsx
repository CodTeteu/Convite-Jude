import { Navigation } from "@/components/layout/Navigation";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { CountdownSection } from "@/components/sections/CountdownSection";
import { EventDetailsSection } from "@/components/sections/EventDetailsSection";
import { FamilySection } from "@/components/sections/FamilySection";
import { FooterSection } from "@/components/sections/FooterSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ManualSection } from "@/components/sections/ManualSection";
import { RSVPSection } from "@/components/sections/RSVPSection";
import { StorySection } from "@/components/sections/StorySection";

export default function HomePage() {
  return (
    <div className="relative overflow-x-clip">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-18%] top-[-8%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,_rgba(208,173,106,0.24),_transparent_62%)] blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,_rgba(48,88,73,0.35),_transparent_70%)] blur-3xl" />
      </div>

      <Navigation />

      <main>
        <HeroSection />
        <CountdownSection />
        <StorySection />
        <GallerySection />
        <FamilySection />
        <EventDetailsSection />
        <ManualSection />
        <RSVPSection />
      </main>

      <FooterSection />
      <MobileStickyCta />
    </div>
  );
}
