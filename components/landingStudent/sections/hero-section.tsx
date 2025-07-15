"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export function HeroSection() {
  const videos = [
    "/celebrate_hero.mp4",
    "/code_ex.mp4", 
    "/happy_students.mp4",
    "/wave_student.mp4",
    "/wee_closeup.mp4"
  ]
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length)
    }, 3000)
    return () => clearInterval(interval)
  }, []) // Only run once on mount
  return (
    <section className="relative min-h-screen flex items-center bg-black overflow-hidden">
      {/* Background video switches to next every 3 seconds, no crossfade */}
      <div className="absolute inset-0 w-full h-full">
        <video
          key={currentVideoIndex}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={videos[currentVideoIndex]}
        />
      </div>
      
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-7xl  font-bold text-white leading-none mb-6"
          >
            No More Waiting. <br />
            Get Interviewed in 48 Hours.
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 items-start items-center pt-32 lg:py-16"
          >
            <Button 
              size="lg" 
              className="bg-white hover:bg-gray-100 text-black px-8 py-4 text-lg font-semibold rounded-full"
            >
              Find Internships
            </Button>
            
            <button className="text-white hover:opacity-70 transition-opacity text-lg font-medium flex items-center">
              → For Employers
            </button>
          </motion.div>
        </div>
      </div>

      {/* Subtle animated elements */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2, delay: 1 }}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1/2 h-full"
      >
        <div className="w-full h-full bg-gradient-to-l from-white/5 to-transparent" />
      </motion.div>
    </section>
  )
}
