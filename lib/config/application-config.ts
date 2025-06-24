/**
 * Application configuration for controlling features
 * 
 * @file application-config.ts
 * @description Centralized configuration for application features
 */

export interface ApplicationConfig {
  /** Controls whether applications are enabled */
  applicationsEnabled: boolean;
  /** Main headline for maintenance modal */
  maintenanceTitle: string;
  /** Primary message to show when applications are disabled */
  maintenanceMessage: string;
  /** Secondary helpful message */
  maintenanceSubMessage: string;
  /** Date when applications will be enabled */
  enableDate: string;
  /** List of things users can do while waiting */
  availableActions: {
    icon: string;
    text: string;
  }[];
}

/**
 * 🚨 MAIN TOGGLE - Change this to control applications
 * 
 * true  = Applications ENABLED (normal operation)
 * false = Applications DISABLED (maintenance mode)
 */
const APPLICATIONS_ENABLED = false; // ← CHANGE THIS LINE

/**
 * Main application configuration
 */
export const APP_CONFIG: ApplicationConfig = {
  applicationsEnabled: APPLICATIONS_ENABLED,
  
  // 📝 Modal content
  maintenanceTitle: "Applications Open Soon!",
  
  maintenanceMessage: "Job applications aren't available yet, but you can get ready! Applications go live on June 29, 2025.",
  
  maintenanceSubMessage: "Get ahead of the competition by preparing now:",
  
  enableDate: "June 29, 2025",
  
  // 📋 Available actions for users
  availableActions: [
    {
      icon: "heart",
      text: "Save jobs you're interested in"
    },
    {
      icon: "user", 
      text: "Complete your profile to stand out"
    },
    {
      icon: "calendar",
      text: "Mark your calendar for June 29th"
    }
  ]
};

/**
 * Emails that can bypass maintenance mode
 * These users can submit applications even when maintenance mode is enabled
 */
const BYPASS_EMAILS = [
  "sherwin_yaun@dlsu.edu.ph",
  "ric_pagulayan@dlsu.edu.ph", 
  "malks_david@dlsu.edu.ph"
];

/**
 * Helper function to check if applications are enabled
 * Accepts optional user email to check for bypass access
 */
export const areApplicationsEnabled = (userEmail?: string): boolean => {
  // If applications are globally enabled, allow access
  if (APP_CONFIG.applicationsEnabled) {
    return true;
  }
  
  // If user email is provided and in bypass list, allow access
  if (userEmail && BYPASS_EMAILS.includes(userEmail.toLowerCase())) {
    return true;
  }
  
  // Otherwise, block access
  return false;
};

/**
 * Get the maintenance title
 */
export const getMaintenanceTitle = (): string => {
  return APP_CONFIG.maintenanceTitle;
};

/**
 * Get the maintenance message
 */
export const getMaintenanceMessage = (): string => {
  return APP_CONFIG.maintenanceMessage;
};

/**
 * Get the maintenance sub-message
 */
export const getMaintenanceSubMessage = (): string => {
  return APP_CONFIG.maintenanceSubMessage;
};

/**
 * Get the enable date
 */
export const getEnableDate = (): string => {
  return APP_CONFIG.enableDate;
};

/**
 * Get available actions
 */
export const getAvailableActions = () => {
  return APP_CONFIG.availableActions;
};
