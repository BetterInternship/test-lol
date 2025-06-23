import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppContext } from "@/lib/ctx-app";

/**
 * Creates a reusable modal component with improved mobile support.
 *
 * @hook
 */
export const useModal = (name: string, options?: { showCloseButton?: boolean }) => {
  const [is_open, set_is_open] = useState(false);
  const { showCloseButton = true } = options || {};
  const { is_mobile } = useAppContext();
  
  // Prevent body scroll when modal is open (especially important on mobile)
  useEffect(() => {
    if (is_open) {
      document.body.style.overflow = 'hidden';
      // Set viewport height for mobile to handle viewport height issues
      if (is_mobile) {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
      }
    } else {
      document.body.style.overflow = 'unset';
      if (is_mobile) {
        document.documentElement.style.removeProperty('--vh');
      }
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.removeProperty('--vh');
    };
  }, [is_open, is_mobile]);
  
  return {
    state: is_open,
    open: () => set_is_open(true),
    close: () => set_is_open(false),
    Modal: ({ children }: { children: React.ReactNode }) => (
      <>
        {is_open && (
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex z-[100] backdrop-blur-sm ${
              is_mobile 
                ? 'items-end justify-center p-0' // Bottom sheet style for mobile
                : 'items-center justify-center p-4'
            }`}
            onClick={() => set_is_open(false)}
            style={{
              // Handle mobile viewport height issues
              height: is_mobile ? 'calc(var(--vh, 1vh) * 100)' : '100vh'
            }}
          >
            <div
              className={`bg-white overflow-hidden shadow-2xl w-full ${
                is_mobile 
                  ? 'max-w-full mx-0 rounded-t-2xl rounded-b-none max-h-[85vh] min-h-[200px] flex flex-col animate-in slide-in-from-bottom duration-300' 
                  : 'max-w-lg rounded-2xl max-h-[85vh] animate-in fade-in zoom-in-95 duration-200'
              }`}
              onClick={(e) => e.stopPropagation()}
              style={{
                // Better mobile height handling
                maxHeight: is_mobile ? 'calc(var(--vh, 1vh) * 85)' : '85vh',
                height: 'auto'
              }}
            >
              {showCloseButton && (
                <div className={`flex justify-end p-4 ${is_mobile ? 'pb-2' : ''}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => set_is_open(false)}
                    className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </Button>
                </div>
              )}
              <div className={`${showCloseButton && is_mobile ? 'pt-0' : ''} flex-1 overflow-hidden`}>
                {children}
              </div>
              {/* Add safe area padding for mobile */}
              {is_mobile && <div className="pb-safe" />}
            </div>
          </div>
        )}
      </>
    ),
  };
};
