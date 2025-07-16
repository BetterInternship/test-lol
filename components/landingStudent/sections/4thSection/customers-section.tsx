"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/landingStudent/use-in-view";
import { animations, motionVariants } from "@/lib/landingStudentLib/animations";

export function CustomersSection() {
  const [sectionRef, isVisible] = useInView(0.3);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-black border-t border-gray-900 overflow-hidden text-white dark:bg-black dark:text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Direct employer connections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
          <motion.div {...motionVariants.fadeInLeft}>
            <h3 className="text-3xl md:text-4xl font-bold text-white dark:text-white mb-4">
              Chat with hiring managers directly
            </h3>
            <p className="text-gray-300 dark:text-gray-300 text-lg">
              No more email delays, just quick replies.
            </p>
          </motion.div>
          <motion.div
            {...motionVariants.fadeInRight}
            transition={{
              ...motionVariants.fadeInRight.transition,
              delay: 0.2,
            }}
          >
            <div className="hidden lg:flex bg-white rounded-2xl p-8 h-64 items-center justify-center">
              <div className="text-center text-7xl">💬</div>
            </div>
          </motion.div>
        </div>

        {/* Multi-industry reach */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
          <motion.div {...motionVariants.fadeInLeft}>
              <div className="hidden lg:flex bg-white rounded-2xl p-8 h-64 items-center justify-center">
              <div className="text-center text-7xl">⚡</div>
            </div>
          </motion.div>
          <motion.div
            {...motionVariants.fadeInRight}
            transition={{
              ...motionVariants.fadeInRight.transition,
              delay: 0.2,
            }}
          >
           <h3 className="text-3xl md:text-4xl font-bold text-white dark:text-white mb-4">
              We make applications a breeze
            </h3>
            <p className="text-gray-300 dark:text-gray-300 text-lg">
              One click, not hours. Welcome to the AI era.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
