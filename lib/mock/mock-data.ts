// Mock Data Store
import { Job, PublicUser, Application, SavedJob, PublicEmployerUser } from "@/lib/db/db.types";

// Mock users data
export const mockUsers: { [key: string]: PublicUser } = {
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
  }
};
// Mock jobs data
export const mockJobs: { [key: string]: Job } = {
  "job-1": {
    id: "job-1",
    title: "Senior Frontend Developer",
    company: "Tech Corp",
    location: "San Francisco, CA",
    type: "Full-time",
    description: "We are looking for a Senior Frontend Developer...",
    requirements: ["5+ years React experience", "TypeScript proficiency"],
    salary_min: 120000,
    salary_max: 180000,
    posted_by: "employer-1",
    is_active: true,
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  "job-2": {
    id: "job-2",
    title: "Backend Engineer",
    company: "StartupXYZ",
    location: "Remote",
    type: "Full-time",
    description: "Join our growing team as a Backend Engineer...",
    requirements: ["Node.js expertise", "Database design skills"],
    salary_min: 100000,
    salary_max: 150000,
    posted_by: "employer-2",
    is_active: true,
    created_at: "2024-01-20T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z",
  }
};

// Mock saved jobs
export const mockSavedJobs: { [userId: string]: SavedJob[] } = {
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
