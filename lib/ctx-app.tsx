/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-04 14:10:41
 * @ Modified time: 2025-06-23 03:15:00
 * @ Description:
 *
 * Centralized app state with improved mobile detection
 */

"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

interface IAppContext {
  is_mobile: boolean;
}

const AppContext = createContext<IAppContext>({} as IAppContext);

export const useAppContext = () => useContext(AppContext);

/**
 * Improved mobile detection that considers:
 * 1. Screen width
 * 2. Touch capability  
 * 3. User agent (as fallback)
 * 4. Orientation
 */
const detectMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  // Primary check: screen width
  const isNarrowScreen = width <= 768; // Changed from 1024 to 768 for more accurate mobile detection
  
  // Secondary check: touch capability
  const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Tertiary check: user agent (fallback)
  const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  // Consider aspect ratio for better tablet detection
  const isPortrait = height > width;
  const aspectRatio = Math.max(width, height) / Math.min(width, height);
  const isTabletAspect = aspectRatio < 1.6; // Tablets typically have lower aspect ratios
  
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
  const [is_mobile, set_is_mobile] = useState(false);

  // Improved mobile detection function
  const check_device_type = () => {
    const isMobile = detectMobile();
    set_is_mobile(isMobile);
  };

  // Check on mount and add resize listener
  useEffect(() => {
    check_device_type();
    
    // Debounce resize events to prevent excessive re-renders
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(check_device_type, 150);
    };
    
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", check_device_type);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", check_device_type);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <AppContext.Provider value={{ is_mobile }}>{children}</AppContext.Provider>
  );
};
