import {
  Job,
  PublicUser,
  UserApplication,
  SavedJob,
  PublicEmployerUser,
  EmployerApplication,
} from "@/lib/db/db.types";
import { APIClient, APIRoute } from "./api-client";
import { FetchResponse } from "@/lib/api/use-fetch";

// Auth Services
interface AuthResponse extends FetchResponse {
  success: boolean;
  user: Partial<PublicUser>;
}

interface OTPRequestResponse extends FetchResponse {
  email: string;
}

interface EmailStatusResponse extends FetchResponse {
  existing_user: boolean;
  verified_user: boolean;
}

interface ResourceHashResponse {
  success?: boolean;
  message?: string;
  hash?: string;
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
    return APIClient.post<EmailStatusResponse>(
      APIRoute("auth").r("email-status").build(),
      { email }
    );
  },

  async send_otp_request(email: string) {
    return APIClient.post<OTPRequestResponse>(
      APIRoute("auth").r("send-new-otp").build(),
      { email }
    );
  },

  async resend_otp_request(email: string) {
    return APIClient.post<OTPRequestResponse>(
      APIRoute("auth").r("resend-new-otp").build(),
      { email }
    );
  },

  async verify_otp(email: string, otp: string) {
    return APIClient.post<AuthResponse>(
      APIRoute("auth").r("verify-otp").build(),
      { email, otp }
    );
  },

  async logout() {
    await APIClient.post<FetchResponse>(APIRoute("auth").r("logout").build());
  },
};
interface UserResponse extends FetchResponse {
  user: Partial<PublicUser>;
}

interface SaveJobResponse extends FetchResponse {
  job?: Job;
  success: boolean;
  message: string;
}

export const user_service = {
  async get_my_profile() {
    return APIClient.get<UserResponse>(APIRoute("users").r("me").build());
  },

  async update_my_profile(data: Partial<PublicUser>) {
    return APIClient.put<UserResponse>(APIRoute("users").r("me").build(), data);
  },

  async get_my_resume_url() {
    return APIClient.get<ResourceHashResponse>(
      APIRoute("users").r("me", "resume").build()
    );
  },

  async get_my_pfp_url() {
    return APIClient.get<ResourceHashResponse>(
      APIRoute("users").r("me", "pic").build()
    );
  },

  async get_user_pfp_url(user_id: string) {
    return APIClient.get<ResourceHashResponse>(
      APIRoute("users").r(user_id, "pic").build()
    );
  },

  async update_my_pfp(file: Blob | null) {
    return APIClient.put<ResourceHashResponse>(
      APIRoute("users").r("me", "pic").build(),
      file,
      "form-data"
    );
  },

  async get_user_resume_url(user_id: string) {
    return APIClient.get<ResourceHashResponse>(
      APIRoute("users").r(user_id, "resume").build()
    );
  },

  async update_my_resume(file: Blob | null) {
    return APIClient.put<Response>(
      APIRoute("users").r("me", "resume").build(),
      file,
      "form-data"
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
interface JobResponse extends FetchResponse {
  job: Job;
}

interface JobsResponse extends FetchResponse {
  jobs?: Job[];
}

interface SavedJobsResponse extends FetchResponse {
  jobs?: SavedJob[];
}

interface OwnedJobsResponse extends FetchResponse {
  jobs: Job[];
}

export const job_service = {
  async get_jobs(params: { last_update: number }) {
    return APIClient.get<JobsResponse>(APIRoute("jobs").p(params).build());
  },

  async get_job_by_id(job_id: string) {
    return APIClient.get<JobResponse>(APIRoute("jobs").r(job_id).build());
  },

  async get_saved_jobs() {
    return APIClient.get<SavedJobsResponse>(
      APIRoute("jobs").r("saved").build()
    );
  },

  async get_owned_jobs() {
    return APIClient.get<OwnedJobsResponse>(
      APIRoute("jobs").r("owned").build()
    );
  },

  async create_job(job: Partial<Job>) {
    return APIClient.post<FetchResponse>(
      APIRoute("jobs").r("create").build(),
      job
    );
  },

  async update_job(job_id: string, job: Partial<Job>) {
    return APIClient.put<FetchResponse>(
      APIRoute("jobs").r(job_id).build(),
      job
    );
  },

  async delete_job(job_id: string) {
    return APIClient.delete<FetchResponse>(APIRoute("jobs").r(job_id).build());
  },
};

// Application Services
interface UserApplicationsResponse extends FetchResponse {
  applications: UserApplication[];
}

interface EmployerApplicationsResponse extends FetchResponse {
  applications: EmployerApplication[];
}

interface UserApplicationResponse extends FetchResponse {
  application: UserApplication;
}

interface EmployerApplicationResponse extends FetchResponse {
  application: EmployerApplication;
}

interface CreateApplicationResponse extends FetchResponse {
  application: UserApplication;
}

export const application_service = {
  async get_applications(
    params: {
      page?: number;
      limit?: number;
      status?: string;
    } = {}
  ) {
    return APIClient.get<UserApplicationsResponse>(
      APIRoute("applications").p(params).build()
    );
  },

  async create_application(data: { job_id: string; cover_letter?: string }) {
    return APIClient.post<CreateApplicationResponse>(
      APIRoute("applications").r("create").build(),
      data
    );
  },

  async get_application_by_id(id: string): Promise<UserApplicationResponse> {
    return APIClient.get<UserApplicationResponse>(
      APIRoute("applications").r(id).build()
    );
  },

  async get_employer_applications(): Promise<EmployerApplicationsResponse> {
    return APIClient.get<EmployerApplicationsResponse>(
      APIRoute("employer").r("applications").build()
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
    return APIClient.put<UserApplicationResponse>(
      APIRoute("applications").r(id).build(),
      data
    );
  },

  async withdraw_application(id: string) {
    return APIClient.delete<FetchResponse>(
      APIRoute("applications").r(id).build()
    );
  },

  async review_application(
    id: string,
    review_options: { review?: string; notes?: string; status?: number }
  ) {
    return APIClient.post<FetchResponse>(
      APIRoute("applications").r(id, "review").build(),
      review_options
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
