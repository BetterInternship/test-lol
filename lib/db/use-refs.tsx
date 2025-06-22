/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-10 04:31:46
 * @ Modified time: 2025-06-22 14:34:06
 * @ Description:
 *
 * Accesses refs directly from the database.
 */

"use client";

import { createContext, useContext } from "react";
import { IRefsContext, createRefsContext } from "./use-refs-backend";

// The context template
const RefsContext = createContext<IRefsContext>({} as IRefsContext);

/**
 * Refs context provider.
 *
 * @component
 */
export const RefsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const refs_context = createRefsContext();
  return (
    <RefsContext.Provider value={refs_context}>{children}</RefsContext.Provider>
  );
};

/**
 * Allows using the refs table we have in supabase as a hook.
 *
 * @hook
 */
export const useRefs = (): IRefsContext => {
  return useContext(RefsContext);
};
