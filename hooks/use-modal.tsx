import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
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
      <AnimatePresence>
        {is_open && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => set_is_open(false)}
            style={{
              // Account for page header on mobile
              paddingTop: is_mobile ? '80px' : '16px'
            }}
          >
            <motion.div
              className="bg-white rounded-lg overflow-hidden shadow-2xl"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              style={{
                // Ensure modal doesn't exceed available height
                maxHeight: is_mobile ? 'calc(100vh - 80px)' : '90vh'
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    ),
  };
};
