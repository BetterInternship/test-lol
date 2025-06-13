// Mock Data Store
import { Job, PublicUser, Application, SavedJob, PublicEmployerUser } from "@/lib/db/db.types";

// Mock users data
export const mockUsers: { [key: string]: PublicUser } = {
  // Default DLSU user - starts without profile
  "user-dlsu": {
    id: "user-dlsu",
    email: "ric_pagulayan@dlsu.edu.ph",
    name: "",
    profile_picture: "",
    phone: "",
    address: "",
    bio: "",
    skills: [],
    education: [],
    experience: [],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  "user-1": {
    id: "user-1",
    email: "john.doe@example.com",
    name: "John Doe",
    profile_picture: "/images/avatars/john.jpg",
    phone: "+1234567890",
    address: "123 Main St, City, Country",
    bio: "Passionate software developer with 5 years of experience",
    skills: ["JavaScript", "React", "Node.js", "TypeScript"],
    education: [
      {
        institution: "University of Technology",
        degree: "Bachelor of Computer Science",
        field: "Computer Science",
        start_date: "2015-09-01",
        end_date: "2019-06-01",
      }
    ],
    experience: [
      {
        company: "Tech Corp",
        position: "Senior Developer",
        description: "Led development of web applications",
        start_date: "2019-07-01",
        end_date: null,
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  }
};

// Mock employer users data
export const mockEmployerUsers: { [key: string]: PublicEmployerUser } = {
  "employer-1": {
    id: "employer-1",
    email: "hr@techcorp.com",
    company_name: "Tech Corp",
    company_logo: "/images/companies/techcorp.png",
    company_description: "Leading technology company",
    company_website: "https://techcorp.com",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  "employer-6": {
    id: "employer-6",
    email: "careers@google.com.ph",
    company_name: "Google Philippines",
    company_logo: "/images/companies/google.png",
    company_description: "Leading global technology company",
    company_website: "https://careers.google.com",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  "employer-7": {
    id: "employer-7",
    email: "careers@ayala.com.ph",
    company_name: "Ayala Corporation",
    company_logo: "/images/companies/ayala.png",
    company_description: "Leading Philippine conglomerate",
    company_website: "https://ayala.com",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  }
};
// Mock jobs data
export const mockJobs: { [key: string]: Job } = {
  "job-1": {
    id: "job-1",
    title: "Senior Frontend Developer",
    company: "Tech Corp",
    location: "San Francisco, CA",
    type: 0, // Internship
    mode: 0, // In-person
    description: "We are looking for a Senior Frontend Developer...",
    requirements: ["5+ years React experience", "TypeScript proficiency"],
    salary_min: 120000,
    salary_max: 180000,
    posted_by: "employer-1",
    is_active: true,
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
    employer: {
      id: "employer-1",
      name: "Tech Corp",
      industry: "Technology",
      description: "Leading technology company",
    },
  },
  "job-2": {
    id: "job-2",
    title: "Backend Engineer",
    company: "StartupXYZ",
    location: "Remote",
    type: 1, // Full-time
    mode: 1, // Remote
    description: "Join our growing team as a Backend Engineer...",
    requirements: ["Node.js expertise", "Database design skills"],
    salary_min: 100000,
    salary_max: 150000,
    posted_by: "employer-2",
    is_active: true,
    created_at: "2024-01-20T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z",
    employer: {
      id: "employer-2",
      name: "StartupXYZ",
      industry: "Technology",
      description: "Innovative startup",
    },
  },
  "job-3": {
    id: "job-3",
    title: "UX/UI Designer Intern",
    company: "Design Studio",
    location: "New York, NY",
    type: 0, // Internship
    mode: 2, // Hybrid
    description: "Looking for a creative UX/UI Designer intern...",
    requirements: ["Figma proficiency", "Portfolio required"],
    salary_min: 40000,
    salary_max: 60000,
    posted_by: "employer-3",
    is_active: true,
    created_at: "2024-01-25T00:00:00Z",
    updated_at: "2024-01-25T00:00:00Z",
    employer: {
      id: "employer-3",
      name: "Design Studio",
      industry: "Design & Arts",
      description: "Creative design agency",
    },
  },
  "job-4": {
    id: "job-4",
    title: "Data Science Intern",
    company: "Analytics Inc",
    location: "Chicago, IL",
    type: 0, // Internship
    mode: 0, // In-person
    description: "Data Science internship opportunity...",
    requirements: ["Python", "Machine Learning basics"],
    salary_min: 50000,
    salary_max: 70000,
    posted_by: "employer-4",
    is_active: true,
    created_at: "2024-01-28T00:00:00Z",
    updated_at: "2024-01-28T00:00:00Z",
    employer: {
      id: "employer-4",
      name: "Analytics Inc",
      industry: "Technology",
      description: "Data analytics company",
    },
  },
  "job-5": {
    id: "job-5",
    title: "Marketing Assistant",
    company: "MediaCo",
    location: "Los Angeles, CA",
    type: 2, // Part-time
    mode: 2, // Hybrid
    description: "Part-time Marketing Assistant position...",
    requirements: ["Social media experience", "Content creation"],
    salary_min: 35000,
    salary_max: 45000,
    posted_by: "employer-5",
    is_active: true,
    created_at: "2024-01-30T00:00:00Z",
    updated_at: "2024-01-30T00:00:00Z",
    employer: {
      id: "employer-5",
      name: "MediaCo",
      industry: "Marketing",
      description: "Digital marketing agency",
    },
  }
};

// Mock saved jobs
export const mockSavedJobs: { [userId: string]: SavedJob[] } = {
  "user-dlsu": [], // Empty for new DLSU user
  "user-1": [
    {
      id: "saved-1",
      user_id: "user-1",
      job_id: "job-1",
      job: mockJobs["job-1"],
      saved_at: "2024-01-16T00:00:00Z",
    }
  ]
};

// Mock applications
export const mockApplications: { [key: string]: Application } = {
  "app-1": {
    id: "app-1",
    job_id: "job-1",
    user_id: "user-1",
    status: "pending",
    cover_letter: "I am excited to apply for this position...",
    github_link: "https://github.com/johndoe",
    portfolio_link: "https://johndoe.dev",
    resume_filename: "john_doe_resume.pdf",
    created_at: "2024-01-17T00:00:00Z",
    updated_at: "2024-01-17T00:00:00Z",
  }
};

// Session storage
export const mockSessions = {
  currentUser: null as PublicUser | null,
  currentEmployer: null as PublicEmployerUser | null,
};
  "job-6": {
    id: "job-6",
    title: "Software Engineering Intern",
    company: "Google Philippines",
    location: "Bonifacio Global City, Taguig",
    type: 0, // Internship
    mode: 2, // Hybrid
    description: "Join Google's engineering team as a Software Engineering Intern. Work on real projects that impact billions of users worldwide.",
    requirements: [
      "Currently pursuing BS Computer Science or related field",
      "Strong programming skills in Java, Python, or C++",
      "Data structures and algorithms knowledge",
      "Available for 3-6 months internship"
    ],
    responsibilities: [
      "Develop scalable software solutions",
      "Collaborate with senior engineers",
      "Participate in code reviews",
      "Write technical documentation"
    ],
    salary_min: 80000,
    salary_max: 100000,
    posted_by: "employer-6",
    is_active: true,
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
    employer: {
      id: "employer-6",
      name: "Google Philippines",
      industry: "Technology",
      description: "Leading global technology company",
    },
  },
  "job-7": {
    id: "job-7",
    title: "Business Analyst Intern",
    company: "Ayala Corporation",
    location: "Makati City",
    type: 0, // Internship
    mode: 0, // In-person
    description: "Support strategic initiatives and business transformation projects at one of the Philippines' largest conglomerates.",
    requirements: [
      "Business Administration or Economics student",
      "Strong analytical and problem-solving skills",
      "Proficient in Excel and PowerPoint",
      "Excellent communication skills"
    ],
    responsibilities: [
      "Conduct market research and analysis",
      "Prepare business presentations",
      "Support project management activities",
      "Analyze financial data and trends"
    ],
    salary_min: 25000,
    salary_max: 35000,
    posted_by: "employer-7",
    is_active: true,
    created_at: "2024-02-03T00:00:00Z",
    updated_at: "2024-02-03T00:00:00Z",
    employer: {
      id: "employer-7",
      name: "Ayala Corporation",
      industry: "Conglomerate",
      description: "Leading Philippine conglomerate",
    },
  },
  "job-8": {
    id: "job-8",
    title: "Graphic Design Intern",
    company: "Canva Philippines",
    location: "Remote",
    type: 0, // Internship
    mode: 1, // Remote
    description: "Create stunning designs and contribute to Canva's mission of empowering the world to design.",
    requirements: [
      "Studying Multimedia Arts, Fine Arts, or related",
      "Portfolio showcasing design work",
      "Proficient in Adobe Creative Suite",
      "Understanding of design principles"
    ],
    responsibilities: [
      "Create social media graphics",
      "Design marketing materials",
      "Collaborate with the design team",
      "Maintain brand consistency"
    ],
    salary_min: 30000,
    salary_max: 40000,
    posted_by: "employer-8",
    is_active: true,
    created_at: "2024-02-05T00:00:00Z",
    updated_at: "2024-02-05T00:00:00Z",
    employer: {
      id: "employer-8",
      name: "Canva Philippines",
      industry: "Technology",
      description: "Global design platform company",
    },
  },
  "job-9": {
    id: "job-9",
    title: "Finance Intern",
    company: "BDO Unibank",
    location: "Ortigas, Pasig City",
    type: 0, // Internship
    mode: 0, // In-person
    description: "Gain hands-on experience in banking and finance at the Philippines' largest bank.",
    requirements: [
      "Finance, Accounting, or Economics student",
      "Strong numerical and analytical skills",
      "Knowledge of financial statements",
      "Detail-oriented and organized"
    ],
    responsibilities: [
      "Assist in financial analysis",
      "Support audit procedures",
      "Prepare financial reports",
      "Handle customer inquiries"
    ],
    salary_min: 20000,
    salary_max: 25000,
    posted_by: "employer-9",
    is_active: true,
    created_at: "2024-02-07T00:00:00Z",
    updated_at: "2024-02-07T00:00:00Z",
    employer: {
      id: "employer-9",
      name: "BDO Unibank",
      industry: "Banking & Finance",
      description: "Philippines' largest bank",
    },
  },
  "job-10": {
    id: "job-10",
    title: "Marketing Intern",
    company: "Unilever Philippines",
    location: "Bonifacio Global City, Taguig",
    type: 0, // Internship
    mode: 2, // Hybrid
    description: "Work on exciting brand campaigns for leading consumer goods brands.",
    requirements: [
      "Marketing or Communications student",
      "Creative thinking abilities",
      "Social media savvy",
      "Strong presentation skills"
    ],
    responsibilities: [
      "Develop marketing campaigns",
      "Manage social media content",
      "Conduct consumer research",
      "Analyze campaign performance"
    ],
    salary_min: 25000,
    salary_max: 30000,
    posted_by: "employer-10",
    is_active: true,
    created_at: "2024-02-10T00:00:00Z",
    updated_at: "2024-02-10T00:00:00Z",
    employer: {
      id: "employer-10",
      name: "Unilever Philippines",
      industry: "Consumer Goods",
      description: "Global consumer goods company",
    },
  },  "job-11": {
    id: "job-11",
    title: "Full Stack Developer",
    company: "Accenture Philippines",
    location: "Eastwood City, Quezon City",
    type: 1, // Full-time
    mode: 2, // Hybrid
    description: "Build innovative solutions for global clients as part of Accenture's technology team.",
    requirements: [
      "BS Computer Science graduate",
      "2+ years experience in web development",
      "React, Node.js, and SQL proficiency",
      "Agile methodology experience"
    ],
    responsibilities: [
      "Develop full-stack applications",
      "Participate in sprint planning",
      "Mentor junior developers",
      "Ensure code quality standards"
    ],
    salary_min: 60000,
    salary_max: 90000,
    posted_by: "employer-11",
    is_active: true,
    created_at: "2024-02-12T00:00:00Z",
    updated_at: "2024-02-12T00:00:00Z",
    employer: {
      id: "employer-11",
      name: "Accenture Philippines",
      industry: "Technology Consulting",
      description: "Global professional services company",
    },
  },
  "job-12": {
    id: "job-12",
    title: "HR Management Trainee",
    company: "San Miguel Corporation",
    location: "Ortigas, Pasig City",
    type: 0, // Internship
    mode: 0, // In-person
    description: "Start your HR career with one of the Philippines' largest and most diversified conglomerates.",
    requirements: [
      "Psychology or HR Management student",
      "Good interpersonal skills",
      "Organized and detail-oriented",
      "Proficient in MS Office"
    ],
    responsibilities: [
      "Assist in recruitment processes",
      "Support employee engagement activities",
      "Maintain HR records",
      "Help with training coordination"
    ],
    salary_min: 20000,
    salary_max: 25000,
    posted_by: "employer-12",
    is_active: true,
    created_at: "2024-02-14T00:00:00Z",
    updated_at: "2024-02-14T00:00:00Z",
    employer: {
      id: "employer-12",
      name: "San Miguel Corporation",
      industry: "Conglomerate",
      description: "Diversified Philippine conglomerate",
    },
  },
  "job-13": {
    id: "job-13",
    title: "Content Writing Intern",
    company: "Rappler",
    location: "Pasig City",
    type: 0, // Internship
    mode: 2, // Hybrid
    description: "Write compelling stories and contribute to one of the Philippines' leading online news platforms.",
    requirements: [
      "Journalism, Communications, or English student",
      "Excellent writing skills",
      "Knowledge of current events",
      "Social media proficiency"
    ],
    responsibilities: [
      "Write news articles and features",
      "Conduct interviews and research",
      "Edit and proofread content",
      "Manage social media posts"
    ],
    salary_min: 15000,
    salary_max: 20000,
    posted_by: "employer-13",
    is_active: true,
    created_at: "2024-02-16T00:00:00Z",
    updated_at: "2024-02-16T00:00:00Z",
    employer: {
      id: "employer-13",
      name: "Rappler",
      industry: "Media",
      description: "Independent online news platform",
    },
  },
  "job-14": {
    id: "job-14",
    title: "Mobile App Developer Intern",
    company: "Globe Telecom",
    location: "Bonifacio Global City, Taguig",
    type: 0, // Internship
    mode: 2, // Hybrid
    description: "Develop innovative mobile solutions for one of the Philippines' leading telecommunications companies.",
    requirements: [
      "Computer Science or IT student",
      "iOS or Android development experience",
      "Knowledge of Swift, Kotlin, or React Native",
      "Understanding of mobile UI/UX"
    ],
    responsibilities: [
      "Develop mobile app features",
      "Test and debug applications",
      "Collaborate with design team",
      "Document code and processes"
    ],
    salary_min: 35000,
    salary_max: 45000,
    posted_by: "employer-14",
    is_active: true,
    created_at: "2024-02-18T00:00:00Z",
    updated_at: "2024-02-18T00:00:00Z",
    employer: {
      id: "employer-14",
      name: "Globe Telecom",
      industry: "Telecommunications",
      description: "Leading telecom provider in the Philippines",
    },
  },
  "job-15": {
    id: "job-15",
    title: "Research Assistant",
    company: "Asian Development Bank",
    location: "Mandaluyong City",
    type: 2, // Part-time
    mode: 0, // In-person
    description: "Support economic research and development projects across Asia and the Pacific.",
    requirements: [
      "Economics or Development Studies student",
      "Strong research and analytical skills",
      "Proficient in statistical software",
      "Excellent English communication"
    ],
    responsibilities: [
      "Conduct literature reviews",
      "Analyze economic data",
      "Prepare research reports",
      "Assist in policy briefs"
    ],
    salary_min: 30000,
    salary_max: 40000,
    posted_by: "employer-15",
    is_active: true,
    created_at: "2024-02-20T00:00:00Z",
    updated_at: "2024-02-20T00:00:00Z",
    employer: {
      id: "employer-15",
      name: "Asian Development Bank",
      industry: "International Development",
      description: "Regional development bank for Asia-Pacific",
    },
  }