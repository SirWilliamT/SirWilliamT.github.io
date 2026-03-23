/**
 * Home — "Liquid Precision" Design System
 * Main portfolio page assembling all sections.
 * Sections: Hero → About → Experience → Skills → Interests → Contact
 */

import CustomCursor from "@/components/CustomCursor";
import LoadingScreen from "@/components/LoadingScreen";
import NavDots from "@/components/NavDots";
import TopNav from "@/components/TopNav";
import MarqueeBanner from "@/components/MarqueeBanner";
import SectionDivider from "@/components/SectionDivider";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import HeroSection from "@/components/sections/HeroSection";
import InterestsSection from "@/components/sections/InterestsSection";
import SkillsSection from "@/components/sections/SkillsSection";

export default function Home() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "oklch(0.09 0.018 240)",
        cursor: "none",
      }}
    >
      {/* Loading screen */}
      <LoadingScreen />

      {/* Custom cursor */}
      <CustomCursor />

      {/* Fixed navigation */}
      <TopNav />
      <NavDots />

      {/* Main content */}
      <main>
        <HeroSection />
        <SectionDivider />
        <AboutSection />
        <MarqueeBanner />
        <ExperienceSection />
        <SectionDivider />
        <SkillsSection />
        <SectionDivider />
        <InterestsSection />
        <SectionDivider />
        <ContactSection />
      </main>
    </div>
  );
}
