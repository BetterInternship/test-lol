import { mockJobs, mockCategories, mockCompanies, mockApplications, userHelpers, applicationHelpers, savedJobsHelpers } from './data';
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

    // Register the email and create user data with provided profile information
    const newUser = userHelpers.registerEmailWithProfile(user.email, user);
    const token = generateMockToken(user.email);

    console.log(`Registered new user: ${user.email} with profile data`);

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

  // User API
  async getProfile() {
    await delay();
    // Check if we have a current user in session
    if (typeof window !== 'undefined') {
      const currentUser = JSON.parse(sessionStorage.getItem('user') || 'null');
      if (currentUser && currentUser.email) {
        const userData = userHelpers.getUserByEmail(currentUser.email);
        if (userData) {
          return userData;
        }
      }
    }
    
    // Return default mock user profile if no session
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
    
    // Get current user from session
    if (typeof window !== 'undefined') {
      const currentUser = JSON.parse(sessionStorage.getItem('user') || 'null');
      if (currentUser && currentUser.email) {
        const currentProfile = userHelpers.getUserByEmail(currentUser.email);
        if (currentProfile) {
          const updatedProfile = { 
            ...currentProfile, 
            ...data, 
            updatedAt: new Date().toISOString() 
          };
          
          // Store updated profile
          const userProfiles = JSON.parse(localStorage.getItem('mockUserProfiles') || '{}');
          userProfiles[currentUser.email.toLowerCase()] = updatedProfile;
          localStorage.setItem('mockUserProfiles', JSON.stringify(userProfiles));
          
          // Update session user data
          sessionStorage.setItem('user', JSON.stringify(updatedProfile));
          
          return updatedProfile;
        }
      }
    }
    
    // Fallback - return updated default profile
    const currentProfile = await this.getProfile();
    return { ...currentProfile, ...data, updatedAt: new Date().toISOString() };
  },

  async getDashboardStats() {
    await delay();
    
    // Get current user from session
    if (typeof window !== 'undefined') {
      const currentUser = JSON.parse(sessionStorage.getItem('user') || 'null');
      if (currentUser && currentUser.email) {
        const userApplications = applicationHelpers.getUserApplications(currentUser.email);
        const userSavedJobs = savedJobsHelpers.getUserSavedJobs(currentUser.email);
        
        // Calculate application statistics
        const totalApplications = userApplications.length;
        const pending = userApplications.filter((app: any) => app.status === 'pending').length;
        const reviewed = userApplications.filter((app: any) => app.status === 'reviewed').length;
        const shortlisted = userApplications.filter((app: any) => app.status === 'shortlisted').length;
        const accepted = userApplications.filter((app: any) => app.status === 'accepted').length;
        const rejected = userApplications.filter((app: any) => app.status === 'rejected').length;
        
        // Generate recent activity from applications
        const recentActivity = userApplications
          .slice(0, 3) // Get last 3 applications
          .map((app: any) => ({
            activity_type: "job_application",
            created_at: app.appliedAt,
            metadata: { job_title: app.job?.title || "Unknown Job" }
          }));

        return {
          applications: {
            total_applications: totalApplications,
            pending,
            reviewed,
            shortlisted,
            accepted,
            rejected
          },
          saved_jobs_count: userSavedJobs.length,
          recent_activity: recentActivity,
          profile_completeness: 85 // Could calculate this based on profile fields
        };
      }
    }
    
    // Fallback to default mock stats
    return {
      applications: {
        total_applications: 0,
        pending: 0,
        reviewed: 0,
        shortlisted: 0,
        accepted: 0,
        rejected: 0
      },
      saved_jobs_count: 0,
      recent_activity: [],
      profile_completeness: 85
    };
  },

  async getSavedJobs(page: number = 1, limit: number = 10) {
    await delay();
    
    // Get current user from session
    if (typeof window !== 'undefined') {
      const currentUser = JSON.parse(sessionStorage.getItem('user') || 'null');
      if (currentUser && currentUser.email) {
        const userSavedJobs = savedJobsHelpers.getUserSavedJobs(currentUser.email);
        
        // Sort by saved date (newest first)
        userSavedJobs.sort((a: any, b: any) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
        
        // Apply pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedSavedJobs = userSavedJobs.slice(startIndex, endIndex);

        return {
          savedJobs: paginatedSavedJobs,
          totalPages: Math.ceil(userSavedJobs.length / limit),
          currentPage: page,
          total: userSavedJobs.length
        };
      }
    }

    // Fallback to empty saved jobs
    return {
      savedJobs: [],
      totalPages: 0,
      currentPage: page,
      total: 0
    };
  },

  async saveJob(jobId: string) {
    await delay();
    
    // Get current user from session
    if (typeof window !== 'undefined') {
      const currentUser = JSON.parse(sessionStorage.getItem('user') || 'null');
      if (currentUser && currentUser.email) {
        return savedJobsHelpers.toggleSaveJob(currentUser.email, jobId);
      }
    }
    
    return { message: "Job saved successfully", state: true };
  },

  async checkSaved(jobId: string) {
    await delay();
    
    // Get current user from session
    if (typeof window !== 'undefined') {
      const currentUser = JSON.parse(sessionStorage.getItem('user') || 'null');
      if (currentUser && currentUser.email) {
        const isSaved = savedJobsHelpers.isJobSaved(currentUser.email, jobId);
        return { state: isSaved };
      }
    }
    
    return { state: false };
  },

  // Applications API
  async getApplications(params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) {
    await delay();
    const { page = 1, limit = 10, status } = params;

    // Get current user from session
    if (typeof window !== 'undefined') {
      const currentUser = JSON.parse(sessionStorage.getItem('user') || 'null');
      if (currentUser && currentUser.email) {
        let userApplications = applicationHelpers.getUserApplications(currentUser.email);
        
        // Apply status filter
        if (status) {
          userApplications = userApplications.filter((app: any) => app.status === status);
        }

        // Sort by application date (newest first)
        userApplications.sort((a: any, b: any) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());

        // Apply pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedApplications = userApplications.slice(startIndex, endIndex);

        return {
          applications: paginatedApplications,
          totalPages: Math.ceil(userApplications.length / limit),
          currentPage: page,
          total: userApplications.length
        };
      }
    }

    // Fallback to empty applications
    return {
      applications: [],
      totalPages: 0,
      currentPage: page,
      total: 0
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
    
    // Get current user from session
    if (typeof window !== 'undefined') {
      const currentUser = JSON.parse(sessionStorage.getItem('user') || 'null');
      if (currentUser && currentUser.email) {
        const newApplication = applicationHelpers.addApplication(currentUser.email, data);
        
        if (newApplication) {
          return {
            message: "Application submitted successfully",
            application: newApplication
          };
        }
      }
    }
    
    throw new Error("Failed to submit application");
  },

  async getApplicationById(id: string) {
    await delay();
    const application = applicationHelpers.getApplicationById(id);
    if (!application) {
      throw new Error('Application not found');
    }
    return application;
  },

  async updateApplication(id: string, data: any) {
    await delay();
    const application = applicationHelpers.getApplicationById(id);
    if (!application) {
      throw new Error('Application not found');
    }
    // For mock mode, just return the updated application
    return { ...application, ...data, updatedAt: new Date().toISOString() };
  },

  async withdrawApplication(id: string) {
    await delay();
    // For now, just return success message - could implement removal logic later
    return { message: "Application withdrawn successfully" };
  },

  async checkApplication(jobId: string) {
    await delay();
    
    // Get current user from session
    if (typeof window !== 'undefined') {
      const currentUser = JSON.parse(sessionStorage.getItem('user') || 'null');
      if (currentUser && currentUser.email) {
        return applicationHelpers.hasAppliedToJob(currentUser.email, jobId);
      }
    }
    
    return { hasApplied: false };
  },

  async getApplicationStats() {
    await delay();
    
    // Get current user from session
    if (typeof window !== 'undefined') {
      const currentUser = JSON.parse(sessionStorage.getItem('user') || 'null');
      if (currentUser && currentUser.email) {
        const userApplications = applicationHelpers.getUserApplications(currentUser.email);
        
        return {
          total_applications: userApplications.length,
          pending: userApplications.filter((app: any) => app.status === 'pending').length,
          reviewed: userApplications.filter((app: any) => app.status === 'reviewed').length,
          shortlisted: userApplications.filter((app: any) => app.status === 'shortlisted').length,
          accepted: userApplications.filter((app: any) => app.status === 'accepted').length,
          rejected: userApplications.filter((app: any) => app.status === 'rejected').length
        };
      }
    }
    
    // Fallback to empty stats
    return {
      total_applications: 0,
      pending: 0,
      reviewed: 0,
      shortlisted: 0,
      accepted: 0,
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
