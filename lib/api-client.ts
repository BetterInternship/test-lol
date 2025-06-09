import { AuthContextTokenStore } from "@/app/student/authctx";

// HTTP client with auth handling
class FetchClient {
  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const token = AuthContextTokenStore.get();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      // @ts-ignore
      headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 unauthorized
      if (response.status === 401) {
        AuthContextTokenStore.remove();
        // Only redirect to login if we're not already on the login page
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/login")
        ) {
          window.location.href = "/login";
        }
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }

      return (await response.text()) as unknown as T;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async get<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: "GET" });
  }

  async post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>(url, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>(url, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: "DELETE" });
  }

  async uploadFile<T>(url: string, formData: FormData): Promise<T> {
    const token = AuthContextTokenStore.get();

    const headers: HeadersInit = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method: "POST",
      headers,
      body: formData,
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 unauthorized
      if (response.status === 401) {
        AuthContextTokenStore.remove();
        // Only redirect to login if we're not already on the login page
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/login")
        ) {
          window.location.href = "/login";
        }
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }

      return (await response.text()) as unknown as T;
    } catch (error) {
      console.error("File upload failed:", error);
      throw error;
    }
  }
}

export const APIClient = new FetchClient();

// API response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  total: number;
}

// Job types
export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  requiresGithub?: boolean;
  requiresPortfolio?: boolean;
  location: string;
  salary?: string;
  type: "Internship" | "Full-time" | "Part-time" | "Contract";
  mode: "Remote" | "Hybrid" | "Face to Face";
  workType: "Remote" | "Hybrid" | "On-site";
  allowance: "Paid" | "Non-paid";
  projectType:
    | "Full-time"
    | "Part-time"
    | "Project-Based/Flexible"
    | "Flexible";
  shift?: string;
  category: string;
  keywords: string[];
  isActive: boolean;
  applicationDeadline?: string;
  startDate?: string;
  duration?: string;
  applicationCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  company: Company;
}

export interface MockInterview {
  id: string;
  title: string;
  questions: {
    roundNumber: string;
    difficultyLevel: string;
    questionText: string;
    questionNumber: string;
    subSkills: string[];
  }[];
  error?: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  industry?: string;
  location?: string;
  website?: string;
  description?: string;
}

// User types
export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  currentProgram?: string;
  idNumber?: string;
  portfolioLink?: string;
  githubLink?: string;
  linkedinProfile?: string;
  resumeFilename?: string;
  profilePicture?: string;
  bio?: string;
  skills: string[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Application types
export interface Application {
  id: string;
  jobId: string;
  coverLetter?: string;
  githubLink?: string;
  portfolioLink?: string;
  resumeFilename?: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "accepted";
  appliedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
  job?: Job;
}

// Error handling
export class ApiError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = "ApiError";
  }
}
