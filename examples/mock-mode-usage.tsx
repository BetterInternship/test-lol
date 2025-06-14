// Example: How to update imports in your application to use mock mode

// ============================================
// BEFORE - Direct API imports (won't use mock)
// ============================================

/*
import { auth_service, user_service, job_service } from '@/lib/api';

// This will always call the real API
const user = await auth_service.login('user@example.com', 'password');
*/

// ============================================
// AFTER - Using API wrapper (supports mock mode)
// ============================================

import { 
  auth_service, 
  user_service, 
  job_service,
  application_service,
  file_service 
} from '@/lib/api-wrapper';

// This will use mock services when mock mode is enabled
const user = await auth_service.login('john.doe@example.com', 'password');

// ============================================
// Example: Checking mock mode status
// ============================================

import { isMockMode } from '@/lib/mock';

export function MyComponent() {
  if (isMockMode()) {
    console.log('Using mock API services');
  }
  
  // Your component code...
}

// ============================================
// Example: Adding the mock toggle to your layout
// ============================================

import { MockModeToggle } from '@/components/mock-mode-toggle';

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <MockModeToggle /> {/* Only visible in development */}
      </body>
    </html>
  );
}

// ============================================
// Example: Programmatically controlling mock mode
// ============================================

import { setMockConfig, getMockConfig } from '@/lib/mock';

// Enable mock mode
setMockConfig({ enabled: true });

// Configure mock behavior
setMockConfig({
  enabled: true,
  delay: 1000, // 1 second delay
  failureRate: 20, // 20% of requests will fail
  logging: false // Disable console logging
});

// Get current configuration
const config = getMockConfig();
console.log('Mock mode enabled:', config.enabled);
