"use client";

import { PublicEmployerUser, PublicUser } from "@/lib/db/db.types";
import { auth_service } from "@/lib/api";
import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

interface IAuthContext {
  user: Partial<PublicUser> | null;
  recheck_authentication: () => Promise<Partial<PublicUser | null>>;
  register: (user: Partial<PublicUser>) => Promise<Partial<PublicUser> | null>;
  verify: (user_id: string, key: string) => Promise<Partial<PublicUser> | null>;
  send_otp_request: (email: string) => Promise<{ email: string }>;
  resend_otp_request: (email: string) => Promise<{ email: string }>;
  verify_otp: (
    email: string,
    otp: string
  ) => Promise<Partial<PublicUser> | null>;
  email_status: (
    email: string
  ) => Promise<{ existing_user: boolean; verified_user: boolean }>;
  logout: () => Promise<void>;
  is_authenticated: () => boolean;
  redirect_if_not_loggedin: () => void;
  redirect_if_logged_in: () => void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const useAuthContext = () => useContext(AuthContext);

/**
 * Gives access to auth functions to the components inside it.
 *
 * @component
 */
export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [should_redirect, set_should_redirect] = useState(false);
  const [is_authenticated, set_is_authenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    const isAuthed = sessionStorage.getItem("isAuthenticated");
    return isAuthed ? JSON.parse(isAuthed) : false;
  });
  const [user, set_user] = useState<Partial<PublicUser> | null>(() => {
    if (typeof window === "undefined") return null;
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  });

  // Whenever user is updated, cache in localStorage
  useEffect(() => {
    if (user) sessionStorage.setItem("user", JSON.stringify(user));
    else sessionStorage.removeItem("user");

    if (is_authenticated)
      sessionStorage.setItem("isAuthenticated", JSON.stringify(true));
    else sessionStorage.removeItem("isAuthenticated");
  }, [user, is_authenticated]);

  const recheck_authentication = async () => {
    const response = await auth_service.loggedin();
    if (!response.success) return null;

    set_user(response.user as PublicUser);
    set_is_authenticated(true);
    return response.user;
  };

  const register = async (user: Partial<PublicUser>) => {
    const response = await auth_service.register(user);
    if (!response.success) return null;

    set_user(response.user as PublicUser);
    set_is_authenticated(true);
    return response;
  };

  const verify = async (user_id: string, key: string) => {
    const response = await auth_service.verify(user_id, key);
    if (!response.success) return null;

    set_user(response.user as PublicUser);
    set_is_authenticated(true);
    return response;
  };

  const send_otp_request = async (email: string) => {
    const response = await auth_service.send_otp_request(email);
    return response;
  };

  const resend_otp_request = async (email: string) => {
    const response = await auth_service.send_otp_request(email);
    return response;
  };

  const verify_otp = async (email: string, otp: string) => {
    const response = await auth_service.verify_otp(email, otp);
    if (!response.success) return null;

    set_user(response.user as PublicUser);
    set_is_authenticated(true);
    return response;
  };

  const email_status = async (email: string) => {
    const response = await auth_service.email_status(email);
    return response;
  };

  const logout = async () => {
    auth_service.logout();
    set_user(null);
    set_is_authenticated(false);
  };

  const redirect_if_not_loggedin = () => {
    if (!is_authenticated) set_should_redirect(true);
  };

  const redirect_if_logged_in = () => {
    if (is_authenticated) set_should_redirect(true);
  };

  useEffect(() => {
    if (should_redirect) {
      if (!is_authenticated) router.push("/login");
      else router.push("/");
    }
  }, [should_redirect]);

  return (
    <AuthContext.Provider
      value={{
        user,
        // @ts-ignore
        recheck_authentication,
        // @ts-ignore
        register,
        // @ts-ignore
        verify,
        send_otp_request,
        resend_otp_request,
        // @ts-ignore
        verify_otp,
        email_status,
        logout,
        is_authenticated: () => is_authenticated,
        redirect_if_not_loggedin,
        redirect_if_logged_in,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Automatically checks whether or not the user is authed when page loaded
 * Calls recheck_authentication
 *
 * @component
 */
export const AuthContextInitter = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { is_authenticated, recheck_authentication } = useAuthContext();

  useEffect(() => {
    if (!is_authenticated()) recheck_authentication();
  }, []);

  return <>{children}</>;
};
