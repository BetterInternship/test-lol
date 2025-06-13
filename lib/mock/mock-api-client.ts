// Mock API Client
import { getMockConfig } from './mock-config';
import { mockUsers, mockEmployerUsers, mockJobs, mockSavedJobs, mockApplications, mockSessions } from './mock-data';
import { ApiResponse } from '../api-client';
import { PublicUser, SavedJob, Application } from '../db/db.types';

// Utility to simulate async delay
const simulateDelay = async (delay?: number) => {
  const config = getMockConfig();
  const actualDelay = delay ?? config.delay ?? 0;
  if (actualDelay > 0) {
    await new Promise(resolve => setTimeout(resolve, actualDelay));
  }
};

// Utility to simulate random failures
const shouldFail = (): boolean => {
  const config = getMockConfig();
  const failureRate = config.failureRate ?? 0;
  return Math.random() * 100 < failureRate;
};

// Logging utility
const logMockCall = (method: string, endpoint: string, data?: any, response?: any) => {
  const config = getMockConfig();
  if (config.logging) {
    console.log(`[MOCK API] ${method} ${endpoint}`, {
      request: data,
      response,
      timestamp: new Date().toISOString(),
    });
  }
};

// Mock HTTP client that mimics the FetchClient interface
export class MockFetchClient {
  private async mockRequest<T>(
    method: string,
    url: string,
    data?: any
  ): Promise<T> {
    await simulateDelay();
    
    if (shouldFail()) {
      logMockCall(method, url, data, { error: 'Mock failure' });
      throw new Error('Mock API failure');
    }

    const response = await this.handleMockEndpoint(method, url, data);
    logMockCall(method, url, data, response);
    return response as T;
  }

  // Handle specific mock endpoints
  private async handleMockEndpoint(method: string, url: string, data?: any): Promise<any> {
    // Extract the path from the full URL
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const path = url.replace(apiBaseUrl, '');
    
    // Auth endpoints
    if (path.includes('/auth/loggedin')) {
      return this.handleLoggedIn();
    }
    
    if (path.includes('/auth/hire/loggedin')) {
      return this.handleEmployerLoggedIn();
    }
    
    if (path.includes('/auth/login')) {
      return this.handleLogin(data);
    }
    
    if (path.includes('/auth/hire/verify-otp')) {
      return this.handleEmployerOTP(data);
    }
    
    if (path.includes('/auth/email-status')) {
      return this.handleEmailStatus(data);
    }
    
    if (path.includes('/auth/send-new-otp')) {
      return this.handleSendOTP(data);
    }
    
    if (path.includes('/auth/verify-otp')) {
      return this.handleOTP(data);
    }
    
    if (path.includes('/auth/register')) {
      return this.handleRegister(data);
    }
    
    if (path.includes('/auth/logout')) {
      return this.handleLogout();
    }
    
    // User endpoints
    if (path.includes('/users/me')) {
      if (method === 'GET') return this.handleGetProfile();
      if (method === 'PUT') return this.handleUpdateProfile(data);
    }
    
    if (path.includes('/users/save-job')) {
      return this.handleSaveJob(data);
    }
    
    // Job endpoints
    if (path.includes('/jobs/saved')) {
      return this.handleGetSavedJobs();
    }
    
    if (path.includes('/jobs/owned')) {
      return this.handleGetOwnedJobs();
    }
    
    if (path.includes('/jobs/detail/')) {
      const jobId = path.split('/').pop();
      return this.handleGetJobById(jobId);
    }
    
    if (path.includes('/jobs')) {
      return this.handleGetJobs(data);
    }
    
    // Application endpoints
    if (path.includes('/applications/stats')) {
      return this.handleGetApplicationStats();
    }
    
    if (path.includes('/applications') && method === 'GET') {
      return this.handleGetApplications(data);
    }
    
    if (path.includes('/applications') && method === 'POST') {
      return this.handleCreateApplication(data);
    }
    
    // Default response
    return { error: 'Mock endpoint not implemented' };
  }

  // Auth handlers
  private handleLoggedIn() {
    if (mockSessions.currentUser) {
      return {
        success: true,
        user: mockSessions.currentUser
      };
    }
    return { success: false, user: null };
  }

  private handleEmployerLoggedIn() {
    if (mockSessions.currentEmployer) {
      return {
        success: true,
        user: mockSessions.currentEmployer
      };
    }
    return { success: false, user: null };
  }

  private handleLogin(data: { email: string; password?: string }) {
    // Check if user exists
    const user = Object.values(mockUsers).find(u => u.email === data.email);
    if (user) {
      mockSessions.currentUser = user;
      return {
        success: true,
        user
      };
    }
    
    // Check if employer exists
    const employer = Object.values(mockEmployerUsers).find(e => e.email === data.email);
    if (employer) {
      mockSessions.currentEmployer = employer;
      return {
        success: true,
        user: employer
      };
    }
    
    return {
      success: false,
      error: 'Invalid credentials'
    };
  }

  private handleOTP(data: { email: string; otp: string }) {
    // Mock OTP verification - accept any 6-digit code
    if (data.otp.length === 6) {
      const user = Object.values(mockUsers).find(u => u.email === data.email);
      if (user) {
        mockSessions.currentUser = user;
        return { success: true, user };
      }
    }
    return { success: false, error: 'Invalid OTP' };
  }

  private handleSendOTP(data: { email: string }) {
    // Mock sending OTP - just return success
    return { email: data.email };
  }

  private handleEmailStatus(data: { email: string }) {
    const user = Object.values(mockUsers).find(u => u.email === data.email);
    if (user) {
      return { existing_user: true, verified_user: true };
    }
    return { existing_user: false, verified_user: false };
  }

  private handleEmployerOTP(data: { email: string; otp: string }) {
    // Mock employer OTP verification
    if (data.otp.length === 6) {
      const employer = Object.values(mockEmployerUsers).find(e => e.email === data.email);
      if (employer) {
        mockSessions.currentEmployer = employer;
        return { success: true, user: employer };
      }
    }
    return { success: false, error: 'Invalid OTP' };
  }

  private handleRegister(data: Partial<PublicUser>) {
    // Create new user - skip OTP in mock mode
    const newUser: PublicUser = {
      id: `user-${Date.now()}`,
      email: data.email || `user${Date.now()}@example.com`,
      name: data.name || data.full_name || 'New User',
      phone: data.phone || data.phone_number || '',
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as PublicUser;
    
    mockUsers[newUser.id] = newUser;
    mockSessions.currentUser = newUser;
    
    return {
      success: true,
      user: newUser
    };
  }

  private handleLogout() {
    mockSessions.currentUser = null;
    mockSessions.currentEmployer = null;
    return { message: 'Logged out successfully' };
  }

  // User handlers
  private handleGetProfile() {
    if (mockSessions.currentUser) {
      return mockSessions.currentUser;
    }
    return { error: 'Not authenticated' };
  }

  private handleUpdateProfile(data: Partial<PublicUser>) {
    if (mockSessions.currentUser) {
      const updatedUser = {
        ...mockSessions.currentUser,
        ...data,
        updated_at: new Date().toISOString(),
      };
      mockUsers[mockSessions.currentUser.id] = updatedUser;
      mockSessions.currentUser = updatedUser;
      return updatedUser;
    }
    return { error: 'Not authenticated' };
  }

  private handleSaveJob(data: { id: string }) {
    if (!mockSessions.currentUser) {
      return { success: false, message: 'Not authenticated' };
    }
    
    const job = mockJobs[data.id];
    if (!job) {
      return { success: false, message: 'Job not found' };
    }
    
    // Check if already saved
    const userSavedJobs = mockSavedJobs[mockSessions.currentUser.id] || [];
    const alreadySaved = userSavedJobs.some(sj => sj.job_id === data.id);
    
    if (alreadySaved) {
      return { success: false, message: 'Job already saved' };
    }
    
    // Add to saved jobs
    const savedJob: SavedJob = {
      id: `saved-${Date.now()}`,
      user_id: mockSessions.currentUser.id,
      job_id: data.id,
      job: job,
      saved_at: new Date().toISOString(),
    };
    
    if (!mockSavedJobs[mockSessions.currentUser.id]) {
      mockSavedJobs[mockSessions.currentUser.id] = [];
    }
    mockSavedJobs[mockSessions.currentUser.id].push(savedJob);
    
    return { success: true, job, message: 'Job saved successfully' };
  }

  // Job handlers
  private handleGetJobs(params: { last_update?: number }) {
    const jobs = Object.values(mockJobs).filter(job => job.is_active);
    return {
      jobs,
      success: true,
      message: 'Jobs fetched successfully'
    };
  }

  private handleGetJobById(jobId?: string) {
    if (!jobId) return { error: 'Job ID required' };
    
    const job = mockJobs[jobId];
    if (!job) return { error: 'Job not found' };
    
    return job;
  }

  private handleGetSavedJobs() {
    if (!mockSessions.currentUser) {
      return { jobs: [], success: false, message: 'Not authenticated' };
    }
    
    const savedJobs = mockSavedJobs[mockSessions.currentUser.id] || [];
    return {
      jobs: savedJobs,
      success: true,
      message: 'Saved jobs fetched successfully'
    };
  }

  private handleGetOwnedJobs() {
    if (!mockSessions.currentEmployer) {
      return { jobs: [], success: false, message: 'Not authenticated' };
    }
    
    const ownedJobs = Object.values(mockJobs).filter(
      job => job.posted_by === mockSessions.currentEmployer!.id
    );
    
    return {
      jobs: ownedJobs,
      success: true,
      message: 'Owned jobs fetched successfully'
    };
  }

  // Application handlers
  private handleGetApplications(params: { page?: number; limit?: number; status?: string }) {
    if (!mockSessions.currentUser) {
      return {
        applications: [],
        totalPages: 0,
        currentPage: 1,
        total: 0
      };
    }
    
    const userApplications = Object.values(mockApplications).filter(
      app => app.user_id === mockSessions.currentUser!.id
    );
    
    return {
      applications: userApplications,
      totalPages: 1,
      currentPage: 1,
      total: userApplications.length
    };
  }

  private handleCreateApplication(data: {
    jobId: string;
    coverLetter?: string;
    githubLink?: string;
    portfolioLink?: string;
    resumeFilename?: string;
  }) {
    if (!mockSessions.currentUser) {
      return { error: 'Not authenticated' };
    }
    
    const newApplication: Application = {
      id: `app-${Date.now()}`,
      job_id: data.jobId,
      user_id: mockSessions.currentUser.id,
      status: 'pending',
      cover_letter: data.coverLetter,
      github_link: data.githubLink,
      portfolio_link: data.portfolioLink,
      resume_filename: data.resumeFilename,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    mockApplications[newApplication.id] = newApplication;
    
    return {
      message: 'Application submitted successfully',
      application: newApplication
    };
  }
  private handleGetApplicationStats() {
    if (!mockSessions.currentUser) {
      return {
        total_applications: 0,
        pending: 0,
        reviewed: 0,
        shortlisted: 0,
        accepted: 0,
        rejected: 0
      };
    }
    
    const userApplications = Object.values(mockApplications).filter(
      app => app.user_id === mockSessions.currentUser!.id
    );
    
    const stats = userApplications.reduce((acc, app) => {
      acc.total_applications++;
      acc[app.status]++;
      return acc;
    }, {
      total_applications: 0,
      pending: 0,
      reviewed: 0,
      shortlisted: 0,
      accepted: 0,
      rejected: 0
    });
    
    return stats;
  }

  // Public methods matching FetchClient interface
  async get<T>(url: string): Promise<T> {
    return this.mockRequest<T>('GET', url);
  }

  async post<T>(url: string, data?: any, type: string = "json"): Promise<T> {
    return this.mockRequest<T>('POST', url, data);
  }

  async put<T>(url: string, data?: any): Promise<T> {
    return this.mockRequest<T>('PUT', url, data);
  }

  async delete<T>(url: string): Promise<T> {
    return this.mockRequest<T>('DELETE', url);
  }

  async uploadFile<T>(url: string, formData: FormData): Promise<T> {
    // Mock file upload
    await simulateDelay();
    
    const mockFileResponse = {
      message: 'File uploaded successfully',
      file: {
        filename: `mock-file-${Date.now()}.pdf`,
        url: '/mock-uploads/file.pdf',
        size: 1024000,
        originalName: 'document.pdf'
      }
    };
    
    logMockCall('UPLOAD', url, 'FormData', mockFileResponse);
    return mockFileResponse as T;
  }
}

// Export singleton instance
export const mockAPIClient = new MockFetchClient();