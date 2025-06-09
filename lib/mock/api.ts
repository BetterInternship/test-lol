import { mockJobs, mockCategories, mockCompanies, mockApplications, userHelpers } from './data';
import { Job, User, Application } from '../api-client';

// Simulate API delays
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Generate a mock JWT token
const generateMockToken = (email: string) => {
  return `mock_jwt_token_${email}_${Date.now()}`;
};

// Helper function to normalize pricing and add frequency
const normalizePricing = (salary: string | null | undefined, showNormalized: boolean = true) => {
  if (!salary || salary.trim() === '') {
    return "Not specified";
  }

  // Extract numeric value from salary string
  const numericValue = parseFloat(salary.replace(/[^\d.]/g, ''));
  
  if (isNaN(numericValue)) {
    return "Not specified";
  }

  let frequency = '';
  let normalizedText = '';

  // Format number with proper decimal places
  const formatNumber = (num: number) => {
    if (num % 1 === 0) {
      // If it's a whole number, don't show decimals
      return num.toLocaleString();
    } else {
      // Show 2 decimal places
      return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
  };

  if (numericValue > 1000) {
    frequency = '/month';
    if (showNormalized) {
      // Calculate normalized daily rate (assuming 22 working days per month)
      const dailyRate = numericValue / 22;
      normalizedText = ` (≈ PHP ${formatNumber(dailyRate)}/day)`;
    }
  } else {
    frequency = '/day';
    if (showNormalized) {
      // Calculate normalized monthly rate (assuming 22 working days per month)
      const monthlyRate = numericValue * 22;
      normalizedText = ` (≈ PHP ${formatNumber(monthlyRate)}/month)`;
    }
  }

  return `PHP ${formatNumber(numericValue)}${frequency}${normalizedText}`;
};

// Helper function to handle empty fields
const handleEmptyField = (value: any): string => {
  if (!value || value === null || value === undefined || 
      (typeof value === 'string' && value.trim() === '')) {
    return "Not specified";
  }
  return value;
};

// Helper function to process job data for listings (no normalized pricing)
const processJobDataForListing = (job: any) => ({
  ...job,
  salary: normalizePricing(job.salary, false), // Don't show normalized pricing in listings
  location: handleEmptyField(job.location),
  mode: handleEmptyField(job.mode),
  workType: handleEmptyField(job.workType),
  allowance: handleEmptyField(job.allowance),
  projectType: handleEmptyField(job.projectType),
  duration: handleEmptyField(job.duration),
  company: job.company ? {
    ...job.company,
    name: handleEmptyField(job.company.name),
    industry: handleEmptyField(job.company.industry),
    location: handleEmptyField(job.company.location),
    website: handleEmptyField(job.company.website),
    description: handleEmptyField(job.company.description)
  } : null
});

// Helper function to process job data for detailed view (with normalized pricing)
const processJobDataForDetail = (job: any) => ({
  ...job,
  salary: normalizePricing(job.salary, true), // Show normalized pricing in detail view
  location: handleEmptyField(job.location),
  mode: handleEmptyField(job.mode),
  workType: handleEmptyField(job.workType),
  allowance: handleEmptyField(job.allowance),
  projectType: handleEmptyField(job.projectType),
  duration: handleEmptyField(job.duration),
  company: job.company ? {
    ...job.company,
    name: handleEmptyField(job.company.name),
    industry: handleEmptyField(job.company.industry),
    location: handleEmptyField(job.company.location),
    website: handleEmptyField(job.company.website),
    description: handleEmptyField(job.company.description)
  } : null
});

// Mock API responses to match your real API structure
export const mockApiService = {
  // Auth API - Simplified for mock mode
  async register(user: Partial<User>) {
    await delay();

    // Validate email
    if (!user.email || !user.email.includes('@dlsu.edu.ph')) {
      throw new Error("Please use a valid DLSU email address");
    }

    // Check if email already registered
    if (userHelpers.isEmailRegistered(user.email)) {
      throw new Error("User with this email already exists");
    }

    // Register the email and create user data
    const newUser = userHelpers.registerEmail(user.email);
    const token = generateMockToken(user.email);

    console.log(`Registered new user: ${user.email}`);

    return {
      token,
      user: newUser
    };
  },

  async emailStatus(email: string) {
    await delay();
    
    const isRegistered = userHelpers.isEmailRegistered(email);
    console.log(`Email status for ${email}: existing=${isRegistered}, verified=${isRegistered}`);
    
    return {
      existing_user: isRegistered,
      verified_user: isRegistered // In simplified mock, registered = verified
    };
  },

  async login(email: string) {
    await delay();
    
    if (!userHelpers.isEmailRegistered(email)) {
      throw new Error("User not found");
    }

    const user = userHelpers.getUserByEmail(email);
    const token = generateMockToken(email);
    
    console.log(`User logged in: ${email}`);

    return {
      token,
      user
    };
  },

  // Simplified - no OTP needed
  async sendOtpRequest(email: string) {
    await delay();
    return { email };
  },

  async verifyOtp(email: string, otp: string) {
    await delay();
    // In simplified mock, any OTP works
    return await this.login(email);
  },

  async verify(userId: string, key: string) {
    await delay();
    // In simplified mock, verification always works
    return {
      token: generateMockToken('verified'),
      user: userHelpers.getUserByEmail('john.doe@students.dlsu.edu.ph')
    };
  },
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

    // Process jobs for listings (no normalized pricing)
    const processedJobs = paginatedJobs.map(processJobDataForListing);

    return {
      jobs: processedJobs,
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
    return processJobDataForDetail(job); // Show normalized pricing in detail view
  },

  async getRecommendedJobs(limit: number = 10) {
    await delay();
    const jobs = mockJobs.slice(0, limit);
    return jobs.map(processJobDataForListing); // No normalized pricing for recommendations
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
      user: { id: "user-1", email: user.email, ...user }
    };
  },

  async login(email: string, password: string) {
    await delay();
    return {
      token: "mock_jwt_token_12345",
      user: userHelpers.getUserByEmail(email) || { id: "user-1", email }
    };
  },

  async verifyOtp(email: string, otp: string) {
    await delay();
    return {
      token: "mock_jwt_token_12345",
      user: userHelpers.getUserByEmail(email) || { id: "user-1", email }
    };
  },

  // User API
  async getProfile() {
    await delay();
    // Return a default mock user profile
    return userHelpers.getUserByEmail('john.doe@students.dlsu.edu.ph') || {
      id: "user-1",
      email: "mock@students.dlsu.edu.ph",
      fullName: "Mock User",
      phoneNumber: "+639123456789",
      currentProgram: "BS Computer Science",
      idNumber: "12112345",
      skills: ["React", "JavaScript"],
      bio: "Mock user profile",
      isActive: true,
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  async updateProfile(data: Partial<User>) {
    await delay();
    // In simplified mock, just return the updated data
    const currentProfile = await this.getProfile();
    return { ...currentProfile, ...data, updatedAt: new Date().toISOString() };
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
      job: processJobDataForListing(job) // Use listing format for saved jobs too
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
      userId: "user-1",
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
