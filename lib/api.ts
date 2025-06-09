import { Job, PublicUser, Application, SavedJob } from "@/lib/db/db.types";
import { APIClient } from "./api-client";

// API configuration and helper funcs
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function for api routes
const APIRoute = (() => {
  interface Params {
    [key: string]: any;
  }

  // Generates a parameter string for query urls
  const search_params = (params: Params) => {
    const search_params = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "")
        search_params.append(key, value.toString());
    });
    return search_params.toString();
  };

  class APIRouteClass {
    routes: string[];
    params: Params | null;

    constructor(base: string) {
      this.routes = [base];
      this.params = null;
    }

    // Adds a subroute
    r(...route: string[]) {
      route.map((r) => this.routes.push(r));
      return this;
    }

    // Adds a list of params
    p(params: Params) {
      this.params = params;
      return this;
    }

    build() {
      if (!this.params) return `${API_BASE_URL}/${this.routes.join("/")}`;
      return `${API_BASE_URL}/${this.routes.join("/")}?${search_params(
        this.params
      )}`;
    }
  }

  return (route: string) => new APIRouteClass(route);
})();

// Warning
if (!API_BASE_URL) console.warn("[WARNING]: Base API URL is not set.");

// Generic Responses
interface NoResponse {}

interface StatusResponse {
  message: string;
  success: boolean;
}

interface ToggleResponse {
  message: string;
  state: boolean;
}

// Auth Services
interface AuthResponse {
  success: boolean;
  user: Partial<PublicUser>;
}

interface EmailStatusResponse {
  existing_user: boolean;
  verified_user: boolean;
}

interface SendOTPResponse {
  email: string;
}

export const auth_service = {
  async loggedin() {
    return APIClient.post<AuthResponse>(APIRoute("auth").r("loggedin").build());
  },

  async register(user: Partial<PublicUser>) {
    return APIClient.post<AuthResponse>(
      APIRoute("auth").r("register").build(),
      user,
      "form-data"
    );
  },

  async login(email: string, password: string = "") {
    if (USE_MOCK_API) {
      return mockApiService.login(email);
    }
    return APIClient.post<AuthResponse>(APIRoute("auth").r("login").build(), {
      email,
      password,
    });
  },

  async verify(user_id: string, key: string) {
    return APIClient.post<AuthResponse>(
      APIRoute("auth").r("verify-email").build(),
      {
        user_id,
        key,
      }
    );
  },

  async email_status(email: string) {
    if (USE_MOCK_API) {
      return mockApiService.emailStatus(email);
    }
    return APIClient.post<EmailStatusResponse>(
      APIRoute("auth").r("email-status").build(),
      { email }
    );
  },

  async send_otp_request(email: string) {
    if (USE_MOCK_API) {
      return mockApiService.sendOtpRequest(email);
    }
    return APIClient.post<SendOTPResponse>(
      APIRoute("auth").r("send-new-otp").build(),
      { email }
    );
  },

  async verify_otp(email: string, otp: string) {
    if (USE_MOCK_API) {
      return mockApiService.verifyOtp(email, otp);
    }
    return APIClient.post<AuthResponse>(
      APIRoute("auth").r("verify-otp").build(),
      { email, otp }
    );
  },

  // ! to implement
  async refresh_token() {},

  async logout() {
    // ! to remove
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }

    if (USE_MOCK_API) {
      return Promise.resolve();
    }
    return APIClient.post<NoResponse>(APIRoute("auth").r("logout").build());
  },
};

// User Services
interface UserResponse extends Partial<PublicUser> {}

interface SaveJobResponse {
  job?: Job;
  success: boolean;
  message: string;
}

export const user_service = {
  async get_profile() {
    if (USE_MOCK_API) {
      return mockApiService.getProfile();
    }
    return APIClient.get<UserResponse>(APIRoute("users").r("profile").build());
  },

  async update_profile(data: Partial<PublicUser>) {
    return APIClient.put<UserResponse>(
      APIRoute("users").r("profile").build(),
      data
    );
  },

  async save_job(job_id: string) {
    return APIClient.post<SaveJobResponse>(
      APIRoute("users").r("save-job").build(),
      { id: job_id }
    );
  },
};

// Job Services
interface JobResponse extends Job {}

interface JobsResponse {
  jobs?: Job[];
  success?: boolean;
  message: string;
}

interface SavedJobsResponse {
  jobs: SavedJob[];
  success?: boolean;
  message: string;
}

export const job_service = {
  async get_jobs(params: { last_update: number }) {
    return APIClient.get<JobsResponse>(APIRoute("jobs").p(params).build());
  },

  async get_job_by_id(job_id: string) {
    if (USE_MOCK_API) {
      return mockApiService.getJobById(job_id);
    }
    return APIClient.get<JobResponse>(
      APIRoute("jobs").r("detail", job_id).build()
    );
  },

  async get_saved_jobs() {
    return APIClient.get<SavedJobsResponse>(
      APIRoute("jobs").r("saved").build()
    );
  },
};

// Application Services
interface ApplicationsResponse {
  applications: Application[];
  totalPages: number;
  currentPage: number;
  total: number;
}

interface ApplicationResponse extends Application {}

interface CreateApplicationResponse {
  message: string;
  application: Application;
}

interface ApplicationStatsResponse {
  total_applications: number;
  pending: number;
  reviewed: number;
  shortlisted: number;
  accepted: number;
  rejected: number;
}

export const application_service = {
  async get_applications(
    params: {
      page?: number;
      limit?: number;
      status?: string;
    } = {}
  ) {
    if (USE_MOCK_API) {
      return mockApiService.getApplications(params);
    }
    return APIClient.get<ApplicationsResponse>(
      APIRoute("applications").p(params).build()
    );
  },

  async create_application(data: {
    jobId: string;
    coverLetter?: string;
    githubLink?: string;
    portfolioLink?: string;
    resumeFilename?: string;
  }) {
    if (USE_MOCK_API) {
      return mockApiService.createApplication(data);
    }
    return APIClient.post<CreateApplicationResponse>(
      APIRoute("applications").build(),
      data
    );
  },

  async get_application_by_id(id: string): Promise<ApplicationResponse> {
    if (USE_MOCK_API) {
      return mockApiService.getApplicationById(id);
    }
    return APIClient.get<ApplicationResponse>(
      APIRoute("applications").r(id).build()
    );
  },

  async update_application(
    id: string,
    data: {
      coverLetter?: string;
      githubLink?: string;
      portfolioLink?: string;
      resumeFilename?: string;
    }
  ) {
    if (USE_MOCK_API) {
      return mockApiService.updateApplication(id, data);
    }
    return APIClient.put<ApplicationResponse>(
      APIRoute("applications").r(id).build(),
      data
    );
  },

  async withdraw_application(id: string) {
    if (USE_MOCK_API) {
      return mockApiService.withdrawApplication(id);
    }
    return APIClient.delete<StatusResponse>(
      APIRoute("applications").r(id).build()
    );
  },

  async get_stats() {
    if (USE_MOCK_API) {
      return mockApiService.getApplicationStats();
    }
    return APIClient.get<ApplicationStatsResponse>(
      APIRoute("applications").r("stats").build()
    );
  },
};

// Error handling utility
export const handle_api_error = (error: any) => {
  console.error("API Error:", error);

  if (error.message === "Unauthorized") {
    // Already handled by apiClient
    return;
  }

  // You can add more specific error handling here
  // For example, show toast notifications

  return error.message || "An unexpected error occurred";
};

// File Services
interface FileUploadResponse {
  message: string;
  file: {
    filename: string;
    url: string;
    size: number;
    originalName: string;
  };
}

export const file_service = {
  async upload_resume(file: File) {
    if (USE_MOCK_API) {
      return mockApiService.uploadResume(file);
    }
    const formData = new FormData();
    formData.append("resume", file);

    return APIClient.uploadFile<FileUploadResponse>(
      APIRoute("files").r("upload", "resume").build(),
      formData
    );
  },

  async upload_profile_picture(file: File) {
    if (USE_MOCK_API) {
      return mockApiService.uploadProfilePicture(file);
    }
    const formData = new FormData();
    formData.append("profilePicture", file);

    return APIClient.uploadFile<FileUploadResponse>(
      APIRoute("files").r("upload", "profile-picture").build(),
      formData
    );
  },

  async delete_resume() {
    if (USE_MOCK_API) {
      return mockApiService.deleteResume();
    }
    return APIClient.delete<StatusResponse>(
      APIRoute("files").r("resume").build()
    );
  },

  async delete_profile_picture() {
    if (USE_MOCK_API) {
      return mockApiService.deleteProfilePicture();
    }
    return APIClient.delete<StatusResponse>(
      APIRoute("files").r("profile-picture").build()
    );
  },
};
