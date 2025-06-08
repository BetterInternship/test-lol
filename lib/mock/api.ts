import { mockJobs, mockCategories, mockCompanies, mockApplications, mockUsers } from './data';
import { Job, User, Application } from '../api-client';

// Simulate API delays
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses to match your real API structure
export const mockApiService = {
  // Jobs API
  async getJobs(params: {
    page?: number;
    limit?: number;
    category?: string;
    type?: string;
    mode?: string;
    search?: string;
    location?: string;
  } = {}) {
    await delay();
    
    const { 
      page = 1, 
      limit = 10, 
      type, 
      mode, 
      search, 
      location 
    } = params;

    let filteredJobs = [...mockJobs];

    // Apply filters
    if (type && type !== "All types") {
      filteredJobs = filteredJobs.filter(job => job.type === type);
    }

    if (mode && mode !== "Any location") {
      filteredJobs = filteredJobs.filter(job => job.mode === mode);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.company?.name.toLowerCase().includes(searchLower)
      );
    }

    if (location) {
      filteredJobs = filteredJobs.filter(job => 
        job.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    return {
      jobs: paginatedJobs,
      totalPages: Math.ceil(filteredJobs.length / limit),
      currentPage: page,
      total: filteredJobs.length
    };
  },

  async getJobById(id: string) {
    await delay();
    const job = mockJobs.find(j => j.id === id);
    if (!job) {
      throw new Error('Job not found');
    }
    return job;
  },

  async getRecommendedJobs(limit: number = 10) {
    await delay();
    return mockJobs.slice(0, limit);
  },

  async getCategories() {
    await delay();
    return mockCategories;
  },

  async trackJobView(jobId: string) {
    await delay();
    return { message: "View tracked successfully" };
  },

  async getSearchSuggestions(query: string) {
    await delay();
    const suggestions = [];
    
    // Job title suggestions
    mockJobs.forEach(job => {
      if (job.title.toLowerCase().includes(query.toLowerCase())) {
        suggestions.push({
          type: "job_title",
          value: job.title
        });
      }
    });

    // Company suggestions
    mockCompanies.forEach(company => {
      if (company.name.toLowerCase().includes(query.toLowerCase())) {
        suggestions.push({
          type: "company", 
          value: company.name
        });
      }
    });

    return suggestions.slice(0, 10);
  },

  // Auth API
  async register(user: Partial<User>) {
    await delay();
    return {
      token: "mock_jwt_token_12345",
      user: { ...mockUsers[0], ...user }
    };
  },

  async login(email: string, password: string) {
    await delay();
    return {
      token: "mock_jwt_token_12345",
      user: mockUsers[0]
    };
  },

  async verifyOtp(email: string, otp: string) {
    await delay();
    return {
      token: "mock_jwt_token_12345",
      user: mockUsers[0]
    };
  },

  // User API
  async getProfile() {
    await delay();
    return mockUsers[0];
  },

  async updateProfile(data: Partial<User>) {
    await delay();
    return { ...mockUsers[0], ...data };
  },

  async getDashboardStats() {
    await delay();
    return {
      applications: {
        total_applications: 5,
        pending: 2,
        reviewed: 1,
        shortlisted: 1,
        accepted: 1,
        rejected: 0
      },
      saved_jobs_count: 3,
      recent_activity: [
        {
          activity_type: "job_application",
          created_at: "2025-06-07T09:00:00.000000+00:00",
          metadata: { job_title: "Frontend Developer Intern" }
        },
        {
          activity_type: "job_view",
          created_at: "2025-06-06T14:30:00.000000+00:00",
          metadata: { job_title: "Backend Developer Intern" }
        }
      ],
      profile_completeness: 85
    };
  },

  async getSavedJobs(page: number = 1, limit: number = 10) {
    await delay();
    const savedJobs = mockJobs.slice(0, 3).map((job, index) => ({
      savedId: `saved-${index + 1}`,
      savedAt: "2025-06-05T10:00:00.000000+00:00",
      job
    }));

    return {
      savedJobs,
      totalPages: 1,
      currentPage: page,
      total: savedJobs.length
    };
  },

  async saveJob(jobId: string) {
    await delay();
    return {
      message: "Job saved successfully",
      state: true
    };
  },

  async checkSaved(jobId: string) {
    await delay();
    return { state: Math.random() > 0.5 }; // Randomly return saved/not saved
  },

  // Applications API
  async getApplications(params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) {
    await delay();
    const { page = 1, limit = 10, status } = params;

    let filteredApps = [...mockApplications];
    if (status) {
      filteredApps = filteredApps.filter(app => app.status === status);
    }

    return {
      applications: filteredApps,
      totalPages: Math.ceil(filteredApps.length / limit),
      currentPage: page,
      total: filteredApps.length
    };
  },

  async createApplication(data: {
    jobId: string;
    coverLetter?: string;
    githubLink?: string;
    portfolioLink?: string;
    resumeFilename?: string;
  }) {
    await delay();
    const newApp = {
      id: `app-${Date.now()}`,
      userId: mockUsers[0].id,
      status: "pending",
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    };
    
    return {
      message: "Application submitted successfully",
      application: newApp
    };
  },

  async getApplicationById(id: string) {
    await delay();
    const app = mockApplications.find(a => a.id === id);
    if (!app) {
      throw new Error('Application not found');
    }
    return app;
  },

  async updateApplication(id: string, data: any) {
    await delay();
    const app = mockApplications.find(a => a.id === id);
    if (!app) {
      throw new Error('Application not found');
    }
    return { ...app, ...data, updatedAt: new Date().toISOString() };
  },

  async withdrawApplication(id: string) {
    await delay();
    return { message: "Application withdrawn successfully" };
  },

  async checkApplication(jobId: string) {
    await delay();
    const hasApplied = Math.random() > 0.7; // 30% chance of having applied
    return {
      hasApplied,
      applicationId: hasApplied ? "app-1" : undefined,
      status: hasApplied ? "pending" : undefined,
      appliedAt: hasApplied ? "2025-06-07T09:00:00.000000+00:00" : undefined
    };
  },

  async getApplicationStats() {
    await delay();
    return {
      total_applications: 5,
      pending: 2,
      reviewed: 1,
      shortlisted: 1,
      accepted: 1,
      rejected: 0
    };
  },

  // File API
  async uploadResume(file: File) {
    await delay(1000); // Longer delay for file upload
    return {
      message: "Resume uploaded successfully",
      file: {
        filename: `resume_${Date.now()}.pdf`,
        url: "https://example.com/resume.pdf",
        size: file.size,
        originalName: file.name
      }
    };
  },

  async uploadProfilePicture(file: File) {
    await delay(1000);
    return {
      message: "Profile picture uploaded successfully",
      file: {
        filename: `profile_${Date.now()}.jpg`,
        url: "https://example.com/profile.jpg", 
        size: file.size,
        originalName: file.name
      }
    };
  },

  async deleteResume() {
    await delay();
    return { message: "Resume deleted successfully" };
  },

  async deleteProfilePicture() {
    await delay();
    return { message: "Profile picture deleted successfully" };
  }
};
