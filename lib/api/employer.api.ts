/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-22 19:43:25
 * @ Modified time: 2025-06-23 05:29:38
 * @ Description:
 *
 * Routes used by employers
 */

import { FetchResponse } from "@/lib/api/use-fetch";
import { PublicEmployerUser } from "../db/db.types";
import { APIClient, APIRoute } from "./api-client";

interface AuthResponse extends FetchResponse {
  success: boolean;
  user: Partial<PublicEmployerUser>;
}

interface OTPRequestResponse extends FetchResponse {
  email: string;
}

interface EmailStatusResponse extends FetchResponse {
  existing_user: boolean;
  verified_user: boolean;
}

export const employer_auth_service = {
  async loggedin() {
    return APIClient.post<AuthResponse>(
      APIRoute("auth").r("hire", "loggedin").build()
    );
  },

  async email_status(email: string) {
    return APIClient.post<EmailStatusResponse>(
      APIRoute("auth").r("hire", "email-status").build(),
      { email }
    );
  },

  async login(email: string, password: string) {
    return APIClient.post<AuthResponse>(
      APIRoute("auth").r("hire", "login").build(),
      { email, password }
    );
  },

  async login_as_employer(employer_id: string) {
    return APIClient.post<AuthResponse>(
      APIRoute("employer").r("proxy", employer_id).build()
    );
  },

  async get_all_employers() {
    return APIClient.get<AuthResponse>(APIRoute("employer").r("all").build());
  },

  async logout() {
    await APIClient.post<FetchResponse>(
      APIRoute("auth").r("hire", "logout").build()
    );
  },
};
