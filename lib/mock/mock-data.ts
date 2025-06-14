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
  },
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
  }};

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