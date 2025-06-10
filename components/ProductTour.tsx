"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, ArrowRight, ArrowLeft, MapPin } from "lucide-react"
import { getTourSteps } from "./tourConfigurations"

export interface TourStep {
  target: string
  title: string
  content: string
  position: 'top' | 'bottom' | 'left' | 'right' | 'center'
  page?: string // Optional page to navigate to
  action?: 'navigate' | 'click' // Optional action to perform
}

interface ProductTourProps {
  isOpen: boolean
  onClose: () => void
  pageName?: string
}

export default function ProductTour({ isOpen, onClose, pageName = 'dashboard' }: ProductTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [tourSteps, setTourSteps] = useState<TourStep[]>([])
  const [isTransitioning, setIsTransitioning] = useState(false)
  const router = useRouter()
  const prevStepRef = useRef(currentStep)

  // Load tour steps based on page
  useEffect(() => {
    const steps = getTourSteps(pageName)
    setTourSteps(steps)
  }, [pageName])

  // Reset tour when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0)
      setIsTransitioning(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || tourSteps.length === 0) return

    const step = tourSteps[currentStep]
    
    // Add transition effect when changing steps
    if (prevStepRef.current !== currentStep) {
      setIsTransitioning(true)
      
      // Clear previous highlight
      setTargetElement(null)
      
      setTimeout(() => {
        if (step?.target === 'welcome') {
          setTargetElement(null)
          setIsTransitioning(false)
          return
        }

        // Handle navigation steps
        if (step?.action === 'navigate' && step.page) {
          router.push(step.page)
          // Wait for navigation to complete before finding element
          setTimeout(() => {
            findAndHighlightElement(step.target)
            setIsTransitioning(false)
          }, 500)
        } else {
          findAndHighlightElement(step.target)
          setIsTransitioning(false)
        }
      }, 300) // Delay for smooth transition
    }
    
    prevStepRef.current = currentStep
  }, [currentStep, isOpen, tourSteps, router])

  const findAndHighlightElement = (target: string) => {
    // Wait for DOM to be ready
    setTimeout(() => {
      const element = document.querySelector(target) as HTMLElement
      if (element) {
        setTargetElement(element)
        
        // Ensure element is visible before scrolling
        const rect = element.getBoundingClientRect()
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight
        
        if (!isVisible) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center'
          })
        }
        
        // Add a slight delay to ensure smooth scrolling completes
        setTimeout(() => {
          // Add a pulsing effect to the target element
          element.style.transition = 'box-shadow 0.3s ease'
          element.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.3)'
          
          // Remove the effect after animation
          setTimeout(() => {
            if (element.style) {
              element.style.boxShadow = ''
            }
          }, 2000)
        }, 300)
      } else {
        console.warn(`Tour target not found: ${target}`)
        setTargetElement(null)
      }
    }, 100) // Small delay to ensure DOM is ready
  }

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeTour()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipTour = () => {
    completeTour()
  }

  const completeTour = () => {
    // Clean up any highlighting
    if (targetElement) {
      targetElement.style.boxShadow = ''
    }
    setIsTransitioning(true)
    setTimeout(() => {
      onClose()
      setIsTransitioning(false)
    }, 200)
  }

  if (!isOpen || tourSteps.length === 0) return null

  const currentTourStep = tourSteps[currentStep]
  const isWelcomeStep = currentTourStep?.target === 'welcome'

  // Calculate position for the tour modal
  const getModalPosition = () => {
    if (isWelcomeStep || !targetElement) {
      return {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10004
      }
    }

    const rect = targetElement.getBoundingClientRect()
    const modalWidth = 350
    const modalHeight = 250
    const padding = 20

    let top = rect.top
    let left = rect.left

    switch (currentTourStep.position) {
      case 'top':
        top = rect.top - modalHeight - padding
        left = rect.left + (rect.width / 2) - (modalWidth / 2)
        break
      case 'bottom':
        top = rect.bottom + padding
        left = rect.left + (rect.width / 2) - (modalWidth / 2)
        break
      case 'left':
        top = rect.top + (rect.height / 2) - (modalHeight / 2)
        left = rect.left - modalWidth - padding
        break
      case 'right':
        top = rect.top + (rect.height / 2) - (modalHeight / 2)
        left = rect.right + padding
        break
    }

    // Ensure modal stays within viewport
    top = Math.max(padding, Math.min(top, window.innerHeight - modalHeight - padding))
    left = Math.max(padding, Math.min(left, window.innerWidth - modalWidth - padding))

    return {
      position: 'fixed' as const,
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 10004
    }
  }

  const progress = ((currentStep + 1) / tourSteps.length) * 100

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Base overlay - only shown when there's no target element */}
          {(isWelcomeStep || !targetElement) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-40 z-10000 backdrop-blur-sm"
              onClick={skipTour}
            />
          )}
          
          {/* Highlight for target element */}
          {!isWelcomeStep && targetElement && !isTransitioning && (
            <>
              {/* Create four overlay divs to cover everything except the target */}
              {/* Top overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed bg-black bg-opacity-40 z-10001"
                style={{
                  top: 0,
                  left: 0,
                  right: 0,
                  height: `${targetElement.getBoundingClientRect().top - 4}px`,
                  pointerEvents: 'auto',
                  cursor: 'pointer'
                }}
                onClick={skipTour}
              />
              
              {/* Bottom overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed bg-black bg-opacity-40 z-10001"
                style={{
                  top: `${targetElement.getBoundingClientRect().bottom + 4}px`,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  pointerEvents: 'auto',
                  cursor: 'pointer'
                }}
                onClick={skipTour}
              />
              
              {/* Left overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed bg-black bg-opacity-40 z-10001"
                style={{
                  top: `${targetElement.getBoundingClientRect().top - 4}px`,
                  left: 0,
                  width: `${targetElement.getBoundingClientRect().left - 4}px`,
                  height: `${targetElement.getBoundingClientRect().height + 8}px`,
                  pointerEvents: 'auto',
                  cursor: 'pointer'
                }}
                onClick={skipTour}
              />
              
              {/* Right overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed bg-black bg-opacity-40 z-10001"
                style={{
                  top: `${targetElement.getBoundingClientRect().top - 4}px`,
                  left: `${targetElement.getBoundingClientRect().right + 4}px`,
                  right: 0,
                  height: `${targetElement.getBoundingClientRect().height + 8}px`,
                  pointerEvents: 'auto',
                  cursor: 'pointer'
                }}
                onClick={skipTour}
              />
              
              {/* Target element highlight */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="fixed pointer-events-none z-10002"
                style={{
                  top: `${targetElement.getBoundingClientRect().top - 4}px`,
                  left: `${targetElement.getBoundingClientRect().left - 4}px`,
                  width: `${targetElement.getBoundingClientRect().width + 8}px`,
                  height: `${targetElement.getBoundingClientRect().height + 8}px`,
                  border: '2px solid #3B82F6',
                  borderRadius: '8px',
                  boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15)',
                  animation: 'pulse 2s infinite'
                }}
              />
            </>
          )}

          {/* Tour Modal */}
          <motion.div
            key={currentStep} // Force re-render on step change
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-xl shadow-2xl p-6 w-80 border border-gray-100"
            style={getModalPosition()}
          >
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-1 mb-4 overflow-hidden">
              <motion.div 
                className="bg-blue-600 h-1 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <motion.h3 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg font-semibold text-gray-900 leading-tight"
              >
                {currentTourStep?.title}
              </motion.h3>
              <button 
                onClick={skipTour}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label="Close tour"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <motion.p 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-700 mb-6 leading-relaxed text-sm"
            >
              {currentTourStep?.content}
            </motion.p>

            {/* Footer */}
            <div className="flex justify-between items-center">
              {/* Step indicator */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {currentStep + 1} of {tourSteps.length}
                </span>
                <div className="flex space-x-1">
                  {tourSteps.map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.8 }}
                      animate={{ 
                        scale: index === currentStep ? 1.2 : 1,
                        backgroundColor: index === currentStep ? '#3B82F6' : '#D1D5DB'
                      }}
                      transition={{ duration: 0.3 }}
                      className={`w-1.5 h-1.5 rounded-full`}
                    />
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="px-3 h-8"
                >
                  <ArrowLeft className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  onClick={nextStep}
                  className="px-4 h-8"
                >
                  {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
                  {currentStep < tourSteps.length - 1 && <ArrowRight className="h-3 w-3 ml-1" />}
                </Button>
              </div>
            </div>

            {/* Skip option */}
            <div className="text-center mt-4">
              <button
                onClick={skipTour}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Skip tour
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
