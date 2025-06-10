"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { usePathname } from "next/navigation"

interface TourContextType {
  showTour: boolean
  startTour: (pageName?: string) => void
  closeTour: () => void
  currentPage: string
}

const TourContext = createContext<TourContextType | undefined>(undefined)

export function ProductTourProvider({ children }: { children: ReactNode }) {
  const [showTour, setShowTour] = useState(false)
  const [currentPage, setCurrentPage] = useState("")
  const pathname = usePathname()

  useEffect(() => {
    // Auto-determine page from pathname
    const pageName = getPageNameFromPath(pathname)
    setCurrentPage(pageName)

    // Auto-start tour for test users on certain pages
    const userEmail = sessionStorage.getItem('userEmail')
    const hasSeenTour = localStorage.getItem(`hasSeenTour_${pageName}`)
    
    if (userEmail === 'test@google.com' && !hasSeenTour && shouldAutoStartTour(pageName)) {
      setTimeout(() => {
        setShowTour(true)
      }, 1000)
    }
  }, [pathname])

  const startTour = (pageName?: string) => {
    if (pageName) {
      setCurrentPage(pageName)
    }
    setShowTour(true)
  }

  const closeTour = () => {
    setShowTour(false)
    localStorage.setItem(`hasSeenTour_${currentPage}`, 'true')
  }

  return (
    <TourContext.Provider value={{ showTour, startTour, closeTour, currentPage }}>
      {children}
    </TourContext.Provider>
  )
}

export function useTour() {
  const context = useContext(TourContext)
  if (!context) {
    throw new Error('useTour must be used within a ProductTourProvider')
  }
  return context
}

function getPageNameFromPath(pathname: string): string {
  // Map pathnames to tour page names
  if (pathname.includes('/hire/dashboard')) return 'dashboard'
  if (pathname.includes('/hire/listings')) return 'listings'
  if (pathname.includes('/hire/forms-automation')) return 'forms-automation'
  if (pathname.includes('/hire/form-generator')) return 'form-generator'
  if (pathname.includes('/hire/company-profile')) return 'company-profile'
  if (pathname.includes('/hire/add-users')) return 'add-users'
  if (pathname.includes('/hire/settings')) return 'settings'
  if (pathname.includes('/hire/signatory-info')) return 'signatory-info'
  if (pathname.includes('/hire/form-data-editor')) return 'form-data-editor'
  if (pathname.includes('/hire/download')) return 'download'
  if (pathname.includes('/hire/pre-hire-forms')) return 'pre-hire-forms'
  if (pathname.includes('/hire/random-info')) return 'random-info'
  
  // Student portal pages
  if (pathname.includes('/student/search')) return 'student-search'
  if (pathname.includes('/student/applications')) return 'student-applications'
  if (pathname.includes('/student/profile')) return 'student-profile'
  if (pathname.includes('/student/saved')) return 'student-saved'
  if (pathname.includes('/student/mock-interview')) return 'student-mock-interview'
  
  // School portal pages
  if (pathname.includes('/school/dashboard')) return 'school-dashboard'
  if (pathname.includes('/school/dashboard/data')) return 'school-data'
  
  return 'default'
}

function shouldAutoStartTour(pageName: string): boolean {
  // Only auto-start tours for main pages, not sub-pages
  const autoStartPages = ['dashboard', 'listings', 'forms-automation', 'student-search', 'school-dashboard']
  return autoStartPages.includes(pageName)
}
