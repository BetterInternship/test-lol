/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-04 14:10:41
 * @ Modified time: 2025-06-16 01:24:27
 * @ Description:
 *
 * Centralized app state
 */

"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

interface IAppContext {
  is_mobile: boolean;
}

const AppContext = createContext<IAppContext>({} as IAppContext);

export const useAppContext = () => useContext(AppContext);

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
  const LIMIT = 1024;

  // Check whether or not the screen size is less than the limit
  const check_screen_size = () => {
    set_is_mobile(window.innerWidth <= LIMIT);
  };

  // Check on mount, and add a listener when screen resizes
  useEffect(() => {
    check_screen_size();
    window.addEventListener("resize", check_screen_size);
    return () => window.removeEventListener("resize", check_screen_size);
  }, []);

  return { is_mobile };
};
