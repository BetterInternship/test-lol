/**
 * Common animation class utilities for consistent transitions
 */
export const animations = {
  // Fade and slide animations
  fadeInLeft: (isVisible: boolean, delay: number = 0) => 
    `transition-all duration-1000 ${delay > 0 ? `delay-[${delay}ms]` : ''} ${isVisible ? "opacity-100 transform translate-x-0" : "opacity-0 transform -translate-x-8"}`,
  
  fadeInRight: (isVisible: boolean, delay: number = 0) => 
    `transition-all duration-1000 ${delay > 0 ? `delay-[${delay}ms]` : ''} ${isVisible ? "opacity-100 transform translate-x-0" : "opacity-0 transform translate-x-8"}`,
  
  fadeInUp: (isVisible: boolean, delay: number = 0) => 
    `transition-all duration-1000 ${delay > 0 ? `delay-[${delay}ms]` : ''} ${isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"}`,
  
  fadeInDown: (isVisible: boolean, delay: number = 0) => 
    `transition-all duration-1000 ${delay > 0 ? `delay-[${delay}ms]` : ''} ${isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-8"}`,

  // Deprecated - use base functions with delay parameter instead
  fadeInLeftDelay: (isVisible: boolean, delay: number = 200) => 
    `transition-all duration-1000 delay-[${delay}ms] ${isVisible ? "opacity-100 transform translate-x-0" : "opacity-0 transform -translate-x-8"}`,
  
  fadeInRightDelay: (isVisible: boolean, delay: number = 200) => 
    `transition-all duration-1000 delay-[${delay}ms] ${isVisible ? "opacity-100 transform translate-x-0" : "opacity-0 transform translate-x-8"}`,
}

/**
 * Common Framer Motion variants for consistent animations
 */
export const motionVariants = {
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
    viewport: { once: true }
  },
  
  fadeInLeft: {
    initial: { opacity: 0, x: -30 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
    viewport: { once: true }
  },
  
  fadeInRight: {
    initial: { opacity: 0, x: 30 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
    viewport: { once: true }
  }
}
