// Mock Module - Main entry point
export { getMockConfig, setMockConfig, type MockConfig } from './mock-config';
export { mockUsers, mockEmployerUsers, mockJobs, mockSavedJobs, mockApplications, mockSessions } from './mock-data';
export { mockAPIClient } from './mock-api-client';
export {
  createMockAuthService,
  createMockUserService,
  createMockJobService,
  createMockApplicationService,
  createMockFileService,
  isMockMode
} from './mock-services';

// Export a function to reset all mock data
export const resetMockData = () => {
  // Clear sessions
  if (typeof window !== 'undefined') {
    const { mockSessions } = require('./mock-data');
    mockSessions.currentUser = null;
    mockSessions.currentEmployer = null;
  }
  
  // You can add more reset logic here if needed
  console.log('[MOCK] Data reset');
};

// Export a function to seed mock data with additional items
export const seedMockData = (options?: {
  users?: number;
  jobs?: number;
  applications?: number;
}) => {
  const { users = 0, jobs = 0, applications = 0 } = options || {};
  
  // Add more mock users
  for (let i = 0; i < users; i++) {
    const userId = `user-seeded-${i}`;
    mockUsers[userId] = {
      id: userId,
      email: `user${i}@example.com`,
      name: `Test User ${i}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as any;
  }
  
  // Add more mock jobs
  for (let i = 0; i < jobs; i++) {
    const jobId = `job-seeded-${i}`;
    mockJobs[jobId] = {
      id: jobId,
      title: `Position ${i}`,
      company: `Company ${i}`,
      location: 'Remote',
      type: 'Full-time',
      description: `Description for position ${i}`,
      requirements: [`Requirement ${i}`],
      salary_min: 50000 + (i * 10000),
      salary_max: 80000 + (i * 10000),
      posted_by: 'employer-1',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as any;
  }
  
  console.log(`[MOCK] Seeded ${users} users and ${jobs} jobs`);
};