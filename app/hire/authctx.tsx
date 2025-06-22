"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { PublicEmployerUser } from "@/lib/db/db.types";
import { useRouter } from "next/navigation";
import { employer_auth_service } from "@/lib/api/employer.api";

interface IAuthContext {
  user: Partial<PublicEmployerUser> | null;
  god: boolean;
  recheck_authentication: () => Promise<Partial<PublicEmployerUser | null>>;
  register: (
    user: Partial<PublicEmployerUser>
  ) => Promise<Partial<PublicEmployerUser> | null>;
  verify: (
    user_id: string,
    key: string
  ) => Promise<Partial<PublicEmployerUser> | null>;
  send_otp_request: (email: string) => Promise<{ email: string }>;
  resend_otp_request: (email: string) => Promise<{ email: string }>;
  verify_otp: (
    email: string,
    otp: string
  ) => Promise<Partial<PublicEmployerUser> | null>;
  email_status: (
    email: string
  ) => Promise<{ existing_user: boolean; verified_user: boolean }>;
  logout: () => Promise<void>;
  is_authenticated: () => boolean;
  redirect_if_not_loggedin: () => void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const useAuthContext = () => useContext(AuthContext);

/**
 * The component that provides the Auth API to its children
 *
 * @component
 */
export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    const isAuthed = sessionStorage.getItem("isAuthenticated");
    return isAuthed ? JSON.parse(isAuthed) : false;
  });
  const [god, setGod] = useState(false);
  const [user, setUser] = useState<Partial<PublicEmployerUser> | null>(() => {
    if (typeof window === "undefined") return null;
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  });

  // Whenever user is updated, cache in localStorage
  useEffect(() => {
    if (user) sessionStorage.setItem("user", JSON.stringify(user));
    else sessionStorage.removeItem("user");

    if (isAuthenticated)
      sessionStorage.setItem("isAuthenticated", JSON.stringify(true));
    else sessionStorage.removeItem("isAuthenticated");
  }, [user, isAuthenticated]);

  const recheck_authentication =
    async (): Promise<Partial<PublicEmployerUser> | null> => {
      const response = await employer_auth_service.loggedin();
      if (!response.success) return null;

      setUser(response.user as PublicEmployerUser);
      setIsAuthenticated(true);
      return response.user as PublicEmployerUser;
    };

  const send_otp_request = async (email: string) => {
    const response = await employer_auth_service.send_otp_request(email);
    return response;
  };

  const resend_otp_request = async (email: string) => {
    const response = await employer_auth_service.send_otp_request(email);
    return response;
  };

  const verify_otp = async (email: string, otp: string) => {
    const response = await employer_auth_service.verify_otp(email, otp);
    if (!response.success) return null;

    setUser(response.user as PublicEmployerUser);
    setIsAuthenticated(true);

    // @ts-ignore
    if (response.god) setGod(true);

    return response;
  };

  const email_status = async (email: string) => {
    const response = await employer_auth_service.email_status(email);
    return response;
  };

  const logout = async () => {
    employer_auth_service.logout();
    router.push("/login");
    setUser(null);
    setIsAuthenticated(false);
  };

  const is_authenticated = () => {
    return isAuthenticated;
  };

  const redirect_if_not_loggedin = () => {
    if (!isAuthenticated) router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        god,
        recheck_authentication,
        send_otp_request,
        resend_otp_request,
        // @ts-ignore
        verify_otp,
        email_status,
        logout,
        is_authenticated,
        redirect_if_not_loggedin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
