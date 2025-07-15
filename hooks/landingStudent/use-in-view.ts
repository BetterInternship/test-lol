import { useEffect, useRef, useState } from "react"

/**
 * Custom hook for intersection observer animations
 * @param threshold - Intersection threshold (default: 0.3)
 * @returns [ref, isVisible] - Ref to attach to element and visibility state
 */
export function useInView(threshold: number = 0.3) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return [ref, isVisible] as const
}
