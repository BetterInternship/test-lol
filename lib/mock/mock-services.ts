// Mock API Services - Drop-in replacement for the real API services
import { getMockConfig } from './mock-config';
import { mockAPIClient } from './mock-api-client';
import type { 
  auth_service as AuthServiceType,
  user_service as UserServiceType,
  job_service as JobServiceType,
  application_service as ApplicationServiceType,
  file_service as FileServiceType
} from '../api';

// Create mock implementations that match the exact interface of the real services
export const createMockAuthService = (): typeof AuthServiceType => ({
  employer: {
    async loggedin() {
      return mockAPIClient.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/hire/loggedin`
      );
    },
    async email_status(email: string) {
      return mockAPIClient.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/hire/email-status`,
        { email }
      );
    },
    async send_otp_request(email: string) {
      return mockAPIClient.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/hire/send-new-otp`,
        { email }
      );
    },
    async verify_otp(email: string, otp: string) {
      return mockAPIClient.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/hire/verify-otp`,
        { email, otp }
      );
    },
    async refresh_token() {},
    async logout() {
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
      return mockAPIClient.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/hire/logout`
      );
    },
  },
  async loggedin() {
    return mockAPIClient.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/loggedin`);
  },
  async register(user: any) {
    return mockAPIClient.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      user,
      "form-data"
    );
  },
  async login(email: string, password: string = "") {
    return mockAPIClient.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      email,
      password,
    });
  },
  async verify(user_id: string, key: string) {
    return mockAPIClient.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`,
      { user_id, key }
    );
  },
  async email_status(email: string) {
    return mockAPIClient.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/email-status`,
      { email }
    );
  },
  async send_otp_request(email: string) {
    return mockAPIClient.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/send-new-otp`,
      { email }
    );
  },
  async verify_otp(email: string, otp: string) {
    return mockAPIClient.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`,
      { email, otp }
    );
  },
  async refresh_token() {},
  async logout() {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
    return mockAPIClient.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`);
  },
});

export const createMockUserService = (): typeof UserServiceType => ({
  async get_profile() {
    return mockAPIClient.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`);
  },
  async update_profile(data: any) {
    return mockAPIClient.put(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, data);
  },
  async save_job(job_id: string) {
    return mockAPIClient.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users/save-job`,
      { id: job_id }
    );
  },
});

export const createMockJobService = (): typeof JobServiceType => ({
  async get_jobs(params: { last_update: number }) {
    return mockAPIClient.get(
      `${process.env.NEXT_PUBLIC_API_URL}/jobs?last_update=${params.last_update}`
    );
  },
  async get_job_by_id(job_id: string) {
    return mockAPIClient.get(
      `${process.env.NEXT_PUBLIC_API_URL}/jobs/detail/${job_id}`
    );
  },
  async get_saved_jobs() {
    return mockAPIClient.get(`${process.env.NEXT_PUBLIC_API_URL}/jobs/saved`);
  },
  async get_owned_jobs() {
    return mockAPIClient.get(`${process.env.NEXT_PUBLIC_API_URL}/jobs/owned`);
  },
  async update_job(job_id: string, job: any) {
    return mockAPIClient.put(
      `${process.env.NEXT_PUBLIC_API_URL}/jobs/${job_id}`,
      job
    );
  },
});

export const createMockApplicationService = (): typeof ApplicationServiceType => ({
  async get_applications(params: { page?: number; limit?: number; status?: string } = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.status) queryParams.append('status', params.status);
    
    return mockAPIClient.get(
      `${process.env.NEXT_PUBLIC_API_URL}/applications?${queryParams.toString()}`
    );
  },
  async create_application(data: any) {
    return mockAPIClient.post(
      `${process.env.NEXT_PUBLIC_API_URL}/applications`,
      data
    );
  },
  async get_application_by_id(id: string) {
    return mockAPIClient.get(
      `${process.env.NEXT_PUBLIC_API_URL}/applications/${id}`
    );
  },
  async update_application(id: string, data: any) {
    return mockAPIClient.put(
      `${process.env.NEXT_PUBLIC_API_URL}/applications/${id}`,
      data
    );
  },
  async withdraw_application(id: string) {
    return mockAPIClient.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/applications/${id}`
    );
  },
  async get_stats() {
    return mockAPIClient.get(
      `${process.env.NEXT_PUBLIC_API_URL}/applications/stats`
    );
  },
});

export const createMockFileService = (): typeof FileServiceType => ({
  async upload_resume(file: File) {
    const formData = new FormData();
    formData.append("resume", file);
    return mockAPIClient.uploadFile(
      `${process.env.NEXT_PUBLIC_API_URL}/files/upload/resume`,
      formData
    );
  },
  async upload_profile_picture(file: File) {
    const formData = new FormData();
    formData.append("profilePicture", file);
    return mockAPIClient.uploadFile(
      `${process.env.NEXT_PUBLIC_API_URL}/files/upload/profile-picture`,
      formData
    );
  },
  async delete_resume() {
    return mockAPIClient.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/files/resume`
    );
  },
  async delete_profile_picture() {
    return mockAPIClient.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/files/profile-picture`
    );
  },
});

// Helper function to check if mock mode is enabled
export const isMockMode = () => {
  const config = getMockConfig();
  return config.enabled;
};