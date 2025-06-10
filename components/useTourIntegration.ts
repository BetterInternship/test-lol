"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { hasPageTour } from "./tourConfigurations"

export function useTourIntegration(pageName: string) {
  const [showTour, setShowTour] = useState(false)
  const pathname = usePathname()

  // Auto-start tour for test users
  useEffect(() => {
    if (!hasPageTour(pageName)) return

    const userEmail = sessionStorage.getItem('userEmail')
    const hasSeenTour = localStorage.getItem(`hasSeenTour_${pageName}`)
    
    // Auto-start for test users on main pages only
    const autoStartPages = ['dashboard', 'listings', 'forms-automation', 'student-search', 'school-dashboard']
    
    if (userEmail === 'test@google.com' && !hasSeenTour && autoStartPages.includes(pageName)) {
      setTimeout(() => {
        setShowTour(true)
      }, 1500) // Slightly longer delay for better UX
    }
  }, [pageName])

  const startTour = () => {
    setShowTour(true)
  }

  const closeTour = () => {
    setShowTour(false)
    localStorage.setItem(`hasSeenTour_${pageName}`, 'true')
  }

  return {
    showTour,
    startTour,
    closeTour,
    hasTour: hasPageTour(pageName)
  }
}
