// API Wrapper - Conditionally uses mock or real services
import { 
  auth_service as real_auth_service,
  user_service as real_user_service,
  job_service as real_job_service,
  application_service as real_application_service,
  file_service as real_file_service,
  handle_api_error
} from './api';

import {
  isMockMode,
  createMockAuthService,
  createMockUserService,
  createMockJobService,
  createMockApplicationService,
  createMockFileService
} from './mock';

// Create service instances
const mockAuthService = createMockAuthService();
const mockUserService = createMockUserService();
const mockJobService = createMockJobService();
const mockApplicationService = createMockApplicationService();
const mockFileService = createMockFileService();

// Export services that automatically use mock when enabled
export const auth_service = new Proxy({} as typeof real_auth_service, {
  get(target, prop) {
    const service = isMockMode() ? mockAuthService : real_auth_service;
    return service[prop as keyof typeof service];
  }
});

export const user_service = new Proxy({} as typeof real_user_service, {
  get(target, prop) {
    const service = isMockMode() ? mockUserService : real_user_service;
    return service[prop as keyof typeof service];
  }
});

export const job_service = new Proxy({} as typeof real_job_service, {
  get(target, prop) {
    const service = isMockMode() ? mockJobService : real_job_service;
    return service[prop as keyof typeof service];
  }
});

export const application_service = new Proxy({} as typeof real_application_service, {
  get(target, prop) {
    const service = isMockMode() ? mockApplicationService : real_application_service;
    return service[prop as keyof typeof service];
  }
});

export const file_service = new Proxy({} as typeof real_file_service, {
  get(target, prop) {
    const service = isMockMode() ? mockFileService : real_file_service;
    return service[prop as keyof typeof service];
  }
});

// Re-export error handler
export { handle_api_error };

// Export mock utilities for development
export { getMockConfig, setMockConfig, resetMockData, seedMockData } from './mock';
