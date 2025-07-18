"use client";

import {
  HeroSection,
  PlatformSection,
  Testimonials,
  LogoCarouselBasic,
  Feature,
} from "@/components/landingStudent/sections";
import { Navigation } from "@/components/landingStudent/navigation";
import { Footer } from "@/components/shared/footer";
import { useAuthContext } from "@/lib/ctx-auth";

export default function HomePage() {
  const { redirectIfLoggedIn } = useAuthContext();
  redirectIfLoggedIn();
  return (
    <div className="min-h-screen bg-black text-white dark dark:bg-black dark:text-white">
      {/* Navbar */}
      <Navigation />
      {/* Hero Section */}
      <HeroSection />
      {/* Apply Fast */}
      <Feature />

      {/* Benefits clickable */}
      <PlatformSection />

      {/* Companies showcase */}
      <LogoCarouselBasic />

      <div className="dark">
        <Footer />
      </div>
    </div>
  );
}
