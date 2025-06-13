// Mock Mode Toggle Component - UI DISABLED
// All mock functionality remains available through environment variables and programmatic access
"use client";

import React from 'react';
import { getMockConfig, setMockConfig, resetMockData, seedMockData } from '@/lib/mock';

export const MockModeToggle: React.FC = () => {
  // Mock Mode UI has been disabled - component returns null to hide the UI
  // All mock functionality remains available through environment variables and programmatic access
  return null;
};

// Export utility functions for programmatic access (if needed)
export {
  getMockConfig,
  setMockConfig, 
  resetMockData,
  seedMockData
} from '@/lib/mock';