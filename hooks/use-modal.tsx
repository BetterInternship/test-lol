import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import { useAppContext } from "@/lib/ctx-app";

/**
 * Creates a reusable modal component.
 *
 * @hook
 */
export const useModal = (name: string, options?: { showCloseButton?: boolean }) => {
  const [is_open, set_is_open] = useState(false);
  const { showCloseButton = true } = options || {};
  const { is_mobile } = useAppContext();
  
  return {
    state: is_open,
    open: () => set_is_open(true),
    close: () => set_is_open(false),
    Modal: ({ children }: { children: React.ReactNode }) => (
      <>
        {is_open && (
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex z-[100] p-4 backdrop-blur-sm ${
              is_mobile ? 'items-start pt-16' : 'items-center justify-center'
            }`}
            onClick={() => set_is_open(false)}
          >
            <div
              className={`bg-white rounded-lg overflow-hidden shadow-2xl w-full ${
                is_mobile 
                  ? 'max-w-full mx-0 max-h-[85vh] flex flex-col' 
                  : 'max-w-4xl max-h-[85vh]'
              }`}
              onClick={(e) => e.stopPropagation()}
              style={{
                // Dynamic height with reasonable limits
                maxHeight: is_mobile ? '80vh' : '85vh',
                height: 'auto'
              }}
            >
              {showCloseButton && (
                <div className="p-4 flex flex-row w-full justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => set_is_open(false)}
                    className="absolute h-8 w-8 p-4 t-0 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </Button>
                </div>
              )}
              {children}
            </div>
          </div>
        )}
      </>
    ),
  };
};
