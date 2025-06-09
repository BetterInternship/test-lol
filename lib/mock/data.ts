// Mock data for frontend development

export const mockCompanies = [
  {
    id: "1",
    name: "TechStart Solutions",
    logo: null,
    industry: "Technology",
    location: "Makati City",
    website: "https://techstart.com",
    description: "Leading technology solutions provider"
  },
  {
    id: "2", 
    name: "CodeCraft Inc",
    logo: null,
    industry: "Technology",
    location: "Taguig City",
    website: "https://codecraft.com",
    description: "Innovative software development company"
  },
  {
    id: "3",
    name: "Grab Philippines",
    logo: null,
    industry: "Technology",
    location: "BGC, Taguig",
    website: "https://grab.com",
    description: "Southeast Asia's leading superapp"
  },
  {
    id: "4",
    name: "Microsoft Philippines", 
    logo: null,
    industry: "Technology",
    location: "BGC, Taguig",
    website: "https://microsoft.com",
    description: "Global technology leader"
  },
  {
    id: "5",
    name: "Creative Hub Studios",
    logo: null,
    industry: "Creative Services",
    location: "Pasig City",
    website: "https://creativehub.com",
    description: "Creative design and branding agency"
  },
  {
    id: "6",
    name: "Unilever Philippines",
    logo: null,
    industry: "Consumer Goods",
    location: "BGC, Taguig", 
    website: "https://unilever.com.ph",
    description: "Leading consumer goods company"
  }
];

export const mockJobs = [
  {
    id: "job-1",
    title: "Frontend Developer Intern",
    description: "Join our dynamic team to create engaging web interfaces and learn modern development practices. You'll work closely with senior developers and designers to build responsive, user-friendly applications.",
    requirements: [
      "Knowledge of HTML, CSS, JavaScript",
      "Familiarity with React or Vue.js", 
      "Basic understanding of responsive design",
      "Good communication skills"
    ],
    responsibilities: [
      "Develop user-friendly web interfaces",
      "Collaborate with design team",
      "Write clean, maintainable code",
      "Test and debug applications"
    ],
    requiresGithub: true,
    requiresPortfolio: true,
    location: "Makati City",
    salary: "300.50",
    type: "Internship",
    mode: "Hybrid",
    workType: "Hybrid",
    allowance: "Non-paid",
    projectType: "Project-Based/Flexible",
    keywords: ["frontend", "developer", "react", "javascript", "html", "css", "web", "interface", "coding"],
    isActive: true,
    applicationDeadline: null,
    startDate: null,
    duration: "3 months",
    viewCount: 45,
    createdAt: "2025-06-08T17:58:09.206764+00:00",
    updatedAt: "2025-06-08T17:58:09.206764+00:00",
    company: mockCompanies[0]
  },
  {
    id: "job-2", 
    title: "Backend Developer Intern",
    description: "Join our dynamic development team as a Backend Developer Intern. You'll work on exciting projects using modern server technologies and gain hands-on experience in building scalable, efficient applications.",
    requirements: [
      "Basic knowledge of Node.js or Python",
      "Understanding of databases",
      "Problem-solving skills", 
      "Eagerness to learn"
    ],
    responsibilities: [
      "Assist in backend development tasks",
      "Learn modern development practices",
      "Participate in code reviews",
      "Support API development"
    ],
    requiresGithub: true,
    requiresPortfolio: false,
    location: "Taguig City",
    salary: "350",
    type: "Internship", 
    mode: "Remote",
    workType: "Remote",
    allowance: "Paid",
    projectType: "Full-time",
    keywords: ["backend", "developer", "node", "python", "api", "database", "server", "programming"],
    isActive: true,
    applicationDeadline: null,
    startDate: null,
    duration: "6 months",
    viewCount: 67,
    createdAt: "2025-06-08T17:58:09.406081+00:00",
    updatedAt: "2025-06-08T17:58:09.406081+00:00", 
    company: mockCompanies[1]
  },
  {
    id: "job-3",
    title: "Data Analyst Intern",
    description: "Analyze data to support business decisions and learn data science methodologies. Work with large datasets and create insights that drive business growth.",
    requirements: [
      "Statistics background",
      "Excel/SQL knowledge",
      "Analytical thinking"
    ],
    responsibilities: [
      "Data analysis",
      "Report generation", 
      "Dashboard creation"
    ],
    requiresGithub: false,
    requiresPortfolio: false,
    location: "BGC, Taguig",
    salary: "320",
    type: "Internship",
    mode: "Remote",
    workType: "Remote", 
    allowance: "",
    projectType: "Flexible",
    keywords: ["data", "analyst", "statistics", "sql", "remote", "intern"],
    isActive: true,
    applicationDeadline: null,
    startDate: null,
    duration: "4 months",
    viewCount: 89,
    createdAt: "2025-06-08T17:58:09.599385+00:00",
    updatedAt: "2025-06-08T17:58:09.599385+00:00",
    company: mockCompanies[2]
  }
];

export const mockCategories = [
  { category: "Internship", count: 6 },
  { category: "Full-time", count: 2 },
  { category: "Part-time", count: 0 }
];

export const mockApplications = [
  {
    id: "app-1",
    jobId: "job-1",
    userId: "user-1",
    coverLetter: "I am excited to apply for this frontend developer position...",
    githubLink: "https://github.com/johndoe",
    portfolioLink: "https://johndoe.dev",
    resumeFilename: "john_doe_resume.pdf",
    status: "pending",
    appliedAt: "2025-06-07T09:00:00.000000+00:00",
    updatedAt: "2025-06-07T09:00:00.000000+00:00"
  }
];

// Simple email storage for mock mode
const getStoredEmails = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('mockRegisteredEmails');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing stored emails:', e);
      }
    }
  }
  return ['john.doe@students.dlsu.edu.ph']; // Default test email
};

let registeredEmails = getStoredEmails();

const saveEmails = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mockRegisteredEmails', JSON.stringify(registeredEmails));
  }
};

// Simple mock user data
const getMockUserData = (email: string) => {
  // Provide different mock data based on email for testing
  const baseData = {
    id: `user-${Date.now()}`,
    email: email,
    fullName: "Mock User",
    phoneNumber: "+639123456789",
    currentProgram: "BS Computer Science",
    idNumber: "12112345",
    skills: ["React", "JavaScript", "HTML", "CSS", "Node.js"],
    bio: "Mock user for testing",
    resumeFilename: null,
    profilePicture: null,
    linkedinProfile: "",
    isActive: true,
    isVerified: true,
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  // Different test scenarios based on email
  if (email.includes('complete')) {
    return {
      ...baseData,
      fullName: "Complete User",
      githubLink: "https://github.com/completeuser",
      portfolioLink: "https://completeuser.dev",
    }
  } else if (email.includes('github')) {
    return {
      ...baseData,
      fullName: "GitHub User", 
      githubLink: "https://github.com/githubuser",
      portfolioLink: "", // Missing portfolio
    }
  } else {
    return {
      ...baseData,
      githubLink: "",
      portfolioLink: "",
    }
  }
};

// Helper functions for simple email management
export const userHelpers = {
  // Add email to registered list
  registerEmail: (email: string) => {
    if (!registeredEmails.includes(email.toLowerCase())) {
      registeredEmails.push(email.toLowerCase());
      saveEmails();
      console.log(`Registered email: ${email}. Total emails: ${registeredEmails.length}`);
    }
    return getMockUserData(email);
  },

  // Add email to registered list with full profile data
  registerEmailWithProfile: (email: string, profileData: any) => {
    if (!registeredEmails.includes(email.toLowerCase())) {
      registeredEmails.push(email.toLowerCase());
      saveEmails();
      console.log(`Registered email with profile: ${email}. Total emails: ${registeredEmails.length}`);
    }

    // Create user data with provided profile information
    const baseUserData = getMockUserData(email);
    const userWithProfile = {
      ...baseUserData,
      // Override with provided profile data
      fullName: profileData.fullName || baseUserData.fullName,
      phoneNumber: profileData.phoneNumber || baseUserData.phoneNumber,
      currentProgram: profileData.currentProgram || baseUserData.currentProgram,
      idNumber: profileData.idNumber || baseUserData.idNumber,
      portfolioLink: profileData.portfolioLink || baseUserData.portfolioLink || "",
      githubLink: profileData.githubLink || baseUserData.githubLink || "",
      linkedinProfile: profileData.linkedinProfile || baseUserData.linkedinProfile || "",
      resumeFile: profileData.resumeFile || baseUserData.resumeFilename,
      skills: profileData.skills || baseUserData.skills,
      bio: profileData.bio || baseUserData.bio,
      // Keep timestamps current
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store the user profile data in localStorage for persistence
    if (typeof window !== 'undefined') {
      const userProfiles = JSON.parse(localStorage.getItem('mockUserProfiles') || '{}');
      userProfiles[email.toLowerCase()] = userWithProfile;
      localStorage.setItem('mockUserProfiles', JSON.stringify(userProfiles));
    }

    return userWithProfile;
  },

  // Check if email is registered
  isEmailRegistered: (email: string) => {
    registeredEmails = getStoredEmails(); // Refresh from storage
    const isRegistered = registeredEmails.includes(email.toLowerCase());
    console.log(`Email ${email} registered:`, isRegistered);
    console.log('All registered emails:', registeredEmails);
    return isRegistered;
  },

  // Get user data for registered email
  getUserByEmail: (email: string) => {
    if (userHelpers.isEmailRegistered(email)) {
      // Check if we have stored profile data
      if (typeof window !== 'undefined') {
        const userProfiles = JSON.parse(localStorage.getItem('mockUserProfiles') || '{}');
        const storedProfile = userProfiles[email.toLowerCase()];
        if (storedProfile) {
          return storedProfile;
        }
      }
      // Fallback to generated mock data
      return getMockUserData(email);
    }
    return null;
  },

  // Get all registered emails
  getAllEmails: () => {
    registeredEmails = getStoredEmails();
    return registeredEmails;
  },

  // Clear all data
  clearAllData: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mockRegisteredEmails');
      localStorage.removeItem('mockUserProfiles');
      localStorage.removeItem('mockApplications');
      localStorage.removeItem('mockSavedJobs');
      registeredEmails = getStoredEmails();
    }
  }
};

// Application helpers for mock mode
export const applicationHelpers = {
  // Get current user's applications
  getUserApplications: (userEmail: string) => {
    if (typeof window !== 'undefined') {
      const applications = JSON.parse(localStorage.getItem('mockApplications') || '{}');
      return applications[userEmail.toLowerCase()] || [];
    }
    return [];
  },

  // Add new application for user
  addApplication: (userEmail: string, application: any) => {
    if (typeof window !== 'undefined') {
      const applications = JSON.parse(localStorage.getItem('mockApplications') || '{}');
      if (!applications[userEmail.toLowerCase()]) {
        applications[userEmail.toLowerCase()] = [];
      }
      
      // Find the job details to include in the application
      const jobData = mockJobs.find(job => job.id === application.jobId);
      
      const fullApplication = {
        ...application,
        id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: userEmail,
        status: 'pending',
        appliedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        job: jobData // Include full job data
      };
      
      applications[userEmail.toLowerCase()].push(fullApplication);
      localStorage.setItem('mockApplications', JSON.stringify(applications));
      
      console.log(`Added application for ${userEmail}:`, fullApplication);
      return fullApplication;
    }
    return null;
  },

  // Check if user has applied to a job
  hasAppliedToJob: (userEmail: string, jobId: string) => {
    const userApplications = applicationHelpers.getUserApplications(userEmail);
    const application = userApplications.find((app: any) => app.jobId === jobId);
    return application ? {
      hasApplied: true,
      applicationId: application.id,
      status: application.status,
      appliedAt: application.appliedAt
    } : {
      hasApplied: false
    };
  },

  // Get application by ID
  getApplicationById: (applicationId: string) => {
    if (typeof window !== 'undefined') {
      const applications = JSON.parse(localStorage.getItem('mockApplications') || '{}');
      for (const userEmail in applications) {
        const userApps = applications[userEmail];
        const application = userApps.find((app: any) => app.id === applicationId);
        if (application) {
          return application;
        }
      }
    }
    return null;
  }
};

// Saved jobs helpers for mock mode
export const savedJobsHelpers = {
  // Get user's saved jobs
  getUserSavedJobs: (userEmail: string) => {
    if (typeof window !== 'undefined') {
      const savedJobs = JSON.parse(localStorage.getItem('mockSavedJobs') || '{}');
      return savedJobs[userEmail.toLowerCase()] || [];
    }
    return [];
  },

  // Toggle save status for a job
  toggleSaveJob: (userEmail: string, jobId: string) => {
    if (typeof window !== 'undefined') {
      const savedJobs = JSON.parse(localStorage.getItem('mockSavedJobs') || '{}');
      if (!savedJobs[userEmail.toLowerCase()]) {
        savedJobs[userEmail.toLowerCase()] = [];
      }
      
      const userSavedJobs = savedJobs[userEmail.toLowerCase()];
      const existingIndex = userSavedJobs.findIndex((saved: any) => saved.jobId === jobId);
      
      if (existingIndex >= 0) {
        // Remove from saved
        userSavedJobs.splice(existingIndex, 1);
        localStorage.setItem('mockSavedJobs', JSON.stringify(savedJobs));
        return { state: false, message: "Job removed from saved" };
      } else {
        // Add to saved
        const jobData = mockJobs.find(job => job.id === jobId);
        const savedJob = {
          savedId: `saved-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          jobId: jobId,
          savedAt: new Date().toISOString(),
          job: jobData
        };
        userSavedJobs.push(savedJob);
        localStorage.setItem('mockSavedJobs', JSON.stringify(savedJobs));
        return { state: true, message: "Job saved successfully" };
      }
    }
    return { state: false, message: "Failed to save job" };
  },

  // Check if job is saved
  isJobSaved: (userEmail: string, jobId: string) => {
    const userSavedJobs = savedJobsHelpers.getUserSavedJobs(userEmail);
    return userSavedJobs.some((saved: any) => saved.jobId === jobId);
  }
};

// Export for backward compatibility
export const mockUsers = [];
export { registeredEmails };
