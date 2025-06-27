"use client";

import { PublicUser } from "@/lib/db/db.types";
import { auth_service } from "@/lib/api/api";
import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FetchResponse } from "@/lib/api/use-fetch";

interface IAuthContext {
  user: (Partial<PublicUser> & FetchResponse) | null;
  register: (
    user: Partial<PublicUser>
  ) => Promise<(Partial<PublicUser> & FetchResponse) | null>;
  verify: (
    user_id: string,
    key: string
  ) => Promise<Partial<PublicUser> & FetchResponse>;
  send_otp_request: (
    email: string
  ) => Promise<{ email: string } & FetchResponse>;
  resend_otp_request: (
    email: string
  ) => Promise<{ email: string } & FetchResponse>;
  verify_otp: (
    email: string,
    otp: string
  ) => Promise<Partial<PublicUser> & FetchResponse>;
  email_status: (
    email: string
  ) => Promise<
    { existing_user: boolean; verified_user: boolean } & FetchResponse
  >;
  logout: () => Promise<void>;
  is_authenticated: () => boolean;
  refresh_authentication: () => void;
  redirect_if_not_logged_in: () => void;
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
  const [is_loading, set_is_loading] = useState(true);
  const [is_authenticated, set_is_authenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    const is_authed = sessionStorage.getItem("is_authenticated");
    return is_authed ? JSON.parse(is_authed) : false;
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
      sessionStorage.setItem("is_authenticated", JSON.stringify(true));
    else sessionStorage.removeItem("is_authenticated");
  }, [user, is_authenticated]);

  const refresh_authentication = async () => {
    const response = await auth_service.loggedin();

    if (!response.success) {
      set_is_loading(false);
      return null;
    }

    set_user(response.user as PublicUser);
    set_is_authenticated(true);
    set_is_loading(false);
    return response.user;
  };

  useEffect(() => {
    refresh_authentication();
  }, []);

  const register = async (user: Partial<PublicUser>) => {
    const response = await auth_service.register(user);
    if (!response.success) return null;
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
    const response = await auth_service.resend_otp_request(email);
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

  const redirect_if_not_logged_in = () =>
    useEffect(() => {
      if (!is_loading && !is_authenticated) router.push("/login");
    }, [is_authenticated, is_loading]);

  const redirect_if_logged_in = () =>
    useEffect(() => {
      if (!is_loading && is_authenticated) router.push("/");
    }, [is_authenticated, is_loading]);

  return (
    <AuthContext.Provider
      value={{
        user,
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
        refresh_authentication,
        is_authenticated: () => is_authenticated,
        redirect_if_not_logged_in,
        redirect_if_logged_in,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
