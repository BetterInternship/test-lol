/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-04 14:10:41
 * @ Modified time: 2025-07-01 19:10:17
 * @ Description:
 *
 * Centralized app state with improved mobile detection
 */

"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

interface IAppContext {
  isMobile: boolean;
}

const AppContext = createContext<IAppContext>({} as IAppContext);

export const useAppContext = () => useContext(AppContext);

/**
 * Improved mobile detection that considers:
 * 1. Screen width
 * 2. Touch capability
 * 3. User agent (as fallback)
 * 4. Orientation
 *
 * @returns
 */
const detectMobile = (): boolean => {
  if (typeof window === "undefined") return false;
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Checks
  const isPortrait = height > width;
  const isNarrowScreen = width <= 768;
  const hasTouchScreen =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const mobileUserAgent =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // Mobile if:
  // - Narrow screen (definitely mobile)
  // - Medium screen + touch + portrait orientation
  // - Touch device with mobile user agent
  return (
    isNarrowScreen ||
    (width <= 1024 && hasTouchScreen && (isPortrait || mobileUserAgent)) ||
    (mobileUserAgent && hasTouchScreen && width <= 1024)
  );
};

/**
 * Gives access to app state to components inside
 *
 * @component
 */
export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const checkMobile = () => setIsMobile(detectMobile());

  // Check on mount and add resize listener
  useEffect(() => {
    checkMobile();

    // Debounce resize events to prevent excessive re-renders
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 250);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", checkMobile);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", checkMobile);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <AppContext.Provider value={{ isMobile }}>{children}</AppContext.Provider>
  );
};
