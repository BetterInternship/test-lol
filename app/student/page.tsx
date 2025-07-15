"use client"

import {
  HeroSection,
  PlatformSection,
  CustomersSection,
  Testimonials,
  LogoCarouselBasic,
  Feature
} from "@/components/landingStudent/sections"
import { Navigation } from "@/components/landingStudent/navigation"

export default function HomePage() {
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
      
      
      {/* Numbers section */}
      <CustomersSection />

      {/* Companies showcase */}
      <LogoCarouselBasic />
     
      
    </div>
  )
}
