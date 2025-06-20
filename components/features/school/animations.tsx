"use client";

import type React from "react";

import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
}: Props) {
  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          y: 15,
        },
        visible: {
          opacity: 1,
          y: 0,
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay, type: "spring", duration }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const ScaleIn = ({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
}: Props) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration }}
    className={className}
  >
    {children}
  </motion.div>
);

export const SlideIn = ({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
}: Props) => (
  <motion.div
    initial={{ x: -20, opacity: 0 }}
    whileInView={{ x: 0, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration }}
    className={className}
  >
    {children}
  </motion.div>
);
