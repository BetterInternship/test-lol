import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAppContext } from "@/lib/ctx-app";

/**
 * Creates a reusable modal component with robust mobile touch handling.
 *
 * @hook
 */
export const useModal = (name: string, options?: { showCloseButton?: boolean }) => {
  const [is_open, set_is_open] = useState(false);
  const { showCloseButton = true } = options || {};
  const { is_mobile } = useAppContext();
  
  // Refs for touch event handling
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; target: EventTarget | null } | null>(null);
  
  // Robust modal close handler
  const closeModal = useCallback(() => {
    set_is_open(false);
  }, []);

  // Touch event handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!is_mobile) return;
    
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      target: e.target
    };
  }, [is_mobile]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!is_mobile || !touchStartRef.current) return;
    
    const touch = e.changedTouches[0];
    const startTouch = touchStartRef.current;
    
    // Calculate touch movement
    const deltaX = Math.abs(touch.clientX - startTouch.x);
    const deltaY = Math.abs(touch.clientY - startTouch.y);
    const isSwipe = deltaX > 10 || deltaY > 10;
    
    // Only close if:
    // 1. Touch started and ended on backdrop (not modal content)
    // 2. It wasn't a swipe gesture
    // 3. Touch target is the backdrop element
    if (!isSwipe && 
        startTouch.target === backdropRef.current && 
        e.target === backdropRef.current) {
      closeModal();
    }
    
    touchStartRef.current = null;
  }, [is_mobile, closeModal]);

  // Click handler for desktop
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    // Only handle mouse events on desktop
    if (is_mobile) return;
    
    if (e.target === backdropRef.current) {
      closeModal();
    }
  }, [is_mobile, closeModal]);

  // Prevent event propagation for modal content
  const handleModalInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  }, []);

  // Body scroll management
  useEffect(() => {
    if (is_open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      // Mobile viewport height handling
      if (is_mobile) {
        const setVH = () => {
          document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
        };
        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);
        
        return () => {
          document.body.style.overflow = originalOverflow;
          document.documentElement.style.removeProperty('--vh');
          window.removeEventListener('resize', setVH);
          window.removeEventListener('orientationchange', setVH);
        };
      }
      
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [is_open, is_mobile]);

  return {
    state: is_open,
    open: () => set_is_open(true),
    close: closeModal,
    Modal: ({ children }: { children: React.ReactNode }) => (
      <>
        {is_open && (
          <div
            ref={backdropRef}
            className={`fixed inset-0 bg-black bg-opacity-50 flex z-[100] backdrop-blur-sm ${
              is_mobile 
                ? 'items-end justify-center p-0' 
                : 'items-center justify-center p-4'
            }`}
            onClick={handleBackdropClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{
              height: is_mobile ? 'calc(var(--vh, 1vh) * 100)' : '100vh'
            }}
          >
            <div
              ref={modalRef}
              className={`bg-white overflow-hidden shadow-2xl w-full ${
                is_mobile 
                  ? 'max-w-full mx-0 rounded-t-2xl rounded-b-none max-h-[85vh] min-h-[200px] flex flex-col animate-in slide-in-from-bottom duration-300' 
                  : 'max-w-2xl rounded-2xl max-h-[85vh] animate-in fade-in zoom-in-95 duration-200'
              }`}
              onClick={handleModalInteraction}
              onTouchStart={handleModalInteraction}
              onTouchEnd={handleModalInteraction}
              style={{
                maxHeight: is_mobile ? 'calc(var(--vh, 1vh) * 85)' : '85vh',
                height: 'auto'
              }}
            >
              {showCloseButton && (
                <div 
                  className={`flex justify-end p-4 ${is_mobile ? 'pb-2' : ''}`}
                  onClick={handleModalInteraction}
                  onTouchStart={handleModalInteraction}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeModal}
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                      closeModal();
                    }}
                    className={`h-8 w-8 p-0 hover:bg-gray-100 rounded-full transition-colors ${
                      is_mobile ? 'active:bg-gray-200' : ''
                    }`}
                    aria-label="Close modal"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </Button>
                </div>
              )}
              <div 
                className={`${showCloseButton && is_mobile ? 'pt-0' : ''} flex-1 overflow-hidden`}
                onClick={handleModalInteraction}
                onTouchStart={handleModalInteraction}
              >
                {children}
              </div>
              {/* Safe area padding for mobile */}
              {is_mobile && (
                <div 
                  className="pb-safe h-4"
                  onClick={handleModalInteraction}
                  onTouchStart={handleModalInteraction}
                />
              )}
            </div>
          </div>
        )}
      </>
    ),
  };
};