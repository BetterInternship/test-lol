"use client";
import { useEffect, useState } from "react";
import { useLoadingContext } from "@/components/school/providers/loader-spinner-provider";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Progress } from "@/components/school/ui/progress";
const LoadingSpinner = () => {
  const { loading, text, progress } = useLoadingContext();
  const [isVisible, setIsVisible] = useState(loading);

  // Handle visibility and disable scrolling
  useEffect(() => {
    if (loading) {
      setIsVisible(true);
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      const timeout = setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = ""; // Re-enable scrolling
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  useEffect(() => {
    const blockKeys = (e: KeyboardEvent) => e.preventDefault();

    if (loading) {
      window.addEventListener("keydown", blockKeys);
    } else {
      window.removeEventListener("keydown", blockKeys);
    }

    return () => window.removeEventListener("keydown", blockKeys);
  }, [loading]);

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        ease: "linear",
        duration: 1.5,
      },
    },
  };

  const overlayVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="pointer-events-auto fixed inset-0 z-[999999] flex items-center justify-center bg-black/75" // Ensure this overlay captures interactions
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          transition={{ duration: 0.15 }}
        >
          <div className="relative flex flex-col items-center">
            <div className="absolute z-20 flex flex-col items-center">
              <motion.svg
                width={55}
                height={55}
                viewBox="0 0 50 50"
                variants={spinnerVariants}
                animate="animate"
              >
                <circle
                  cx="25"
                  cy="25"
                  r="20"
                  stroke="#1c9df9"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 20}
                  strokeDashoffset={2 * Math.PI * 20 * 0.25}
                />
              </motion.svg>

              <div className="absolute bottom-[10px]"></div>
            </div>

            {text && (
              <motion.div className="mt-20 w-[350px] sm:mt-16 md:mt-16 lg:mt-14">
                <p className="text-center text-sm font-bold text-white sm:text-base md:text-lg lg:text-xl">
                  {text} <AnimatedEllipsis />
                </p>
              </motion.div>
            )}
            {typeof progress === "number" && progress >= 0 && (
              <>
                <Progress value={progress} className="mt-5 mb-2 w-[75%]" />
                <p className="text-center text-sm font-medium text-white">
                  {progress}% Complete
                </p>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function AnimatedEllipsis() {
  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2,
          },
        },
      }}
    >
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 0 },
            visible: {
              opacity: [0, 1, 0],
              y: [0, -5, 0],
              transition: {
                repeat: Infinity,
                duration: 1,
                delay: index * 0.2,
              },
            },
          }}
          className="text-white"
        >
          .
        </motion.span>
      ))}
    </motion.span>
  );
}

export default LoadingSpinner;
