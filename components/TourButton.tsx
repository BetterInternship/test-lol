"use client"

import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import { hasPageTour } from "./tourConfigurations"

interface TourButtonProps {
  onClick: () => void
  pageName: string
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
  className?: string
}

export default function TourButton({ 
  onClick, 
  pageName, 
  variant = "outline",
  size = "sm",
  className = ""
}: TourButtonProps) {
  // Don't render if no tour is configured for this page
  if (!hasPageTour(pageName)) {
    return null
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors ${className}`}
    >
      <HelpCircle className="h-4 w-4" />
      Tutorial
    </Button>
  )
}
