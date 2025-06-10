"use client"

import ProductTour from "@/components/ProductTour"
import TourButton from "@/components/TourButton"
import { useTourIntegration } from "@/components/useTourIntegration"

interface PageTourWrapperProps {
  pageName: string
  children: React.ReactNode
  className?: string
}

export default function PageTourWrapper({ pageName, children, className = "" }: PageTourWrapperProps) {
  const { showTour, startTour, closeTour } = useTourIntegration(pageName)

  return (
    <div className={className}>
      {children}
      
      {/* Tour Button Component (can be placed anywhere in the page) */}
      <div className="tour-button-placeholder" style={{ display: 'none' }}>
        <TourButton
          onClick={startTour}
          pageName={pageName}
        />
      </div>

      {/* Product Tour */}
      <ProductTour
        isOpen={showTour}
        onClose={closeTour}
        pageName={pageName}
      />
    </div>
  )
}

// Hook for easy integration into existing components
export function usePageTour(pageName: string) {
  const { showTour, startTour, closeTour } = useTourIntegration(pageName)
  
  return {
    showTour,
    startTour,
    closeTour,
    TourButton: () => (
      <TourButton
        onClick={startTour}
        pageName={pageName}
      />
    ),
    ProductTour: () => (
      <ProductTour
        isOpen={showTour}
        onClose={closeTour}
        pageName={pageName}
      />
    )
  }
}
