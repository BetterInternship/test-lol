// Mock Mode Configuration
export interface MockConfig {
  enabled: boolean;
  delay?: number; // Simulate network delay in ms
  failureRate?: number; // Percentage of requests that should fail (0-100)
  logging?: boolean; // Log mock API calls
}

// Default mock configuration
export const defaultMockConfig: MockConfig = {
  enabled: false,
  delay: 300, // 300ms default delay
  failureRate: 0,
  logging: true,
};

// Get mock configuration from environment or localStorage
export const getMockConfig = (): MockConfig => {
  // Check environment variable first
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
    return {
      ...defaultMockConfig,
      enabled: true,
    };
  }

  // Check localStorage for runtime configuration
  if (typeof window !== 'undefined') {
    const storedConfig = localStorage.getItem('mockConfig');
    if (storedConfig) {
      try {
        return { ...defaultMockConfig, ...JSON.parse(storedConfig) };
      } catch (e) {
        console.error('Failed to parse mock config from localStorage:', e);
      }
    }
  }

  return defaultMockConfig;
};

// Set mock configuration in localStorage
export const setMockConfig = (config: Partial<MockConfig>) => {
  if (typeof window !== 'undefined') {
    const currentConfig = getMockConfig();
    const newConfig = { ...currentConfig, ...config };
    localStorage.setItem('mockConfig', JSON.stringify(newConfig));
    
    // Reload the page to apply new configuration
    if (config.enabled !== undefined && config.enabled !== currentConfig.enabled) {
      window.location.reload();
    }
  }
};
