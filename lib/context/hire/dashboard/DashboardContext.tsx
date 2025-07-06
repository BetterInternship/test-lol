// Context for sharing selected application across dashboard components
// Eliminates props drilling - use useDashboardContext() to access
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { EmployerApplication } from '@/lib/db/db.types';

interface DashboardContextType {
  selectedApplication: EmployerApplication | null;
  setSelectedApplication: (app: EmployerApplication | null) => void;
}

const DashboardContext = createContext<DashboardContextType>({
  selectedApplication: null,
  setSelectedApplication: () => {},
});

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [selectedApplication, setSelectedApplication] = useState<EmployerApplication | null>(null);

  return (
    <DashboardContext.Provider
      value={{
        selectedApplication,
        setSelectedApplication,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardContext must be used within DashboardProvider');
  }
  return context;
}

export default DashboardContext;
