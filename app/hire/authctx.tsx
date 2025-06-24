"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { PublicEmployerUser } from "@/lib/db/db.types";
import { useRouter } from "next/navigation";
import { employer_auth_service } from "@/lib/api/employer.api";

interface IAuthContext {
  user: Partial<PublicEmployerUser> | null;
  god: boolean;
  register: (
    user: Partial<PublicEmployerUser>
  ) => Promise<Partial<PublicEmployerUser> | null>;
  verify: (
    user_id: string,
    key: string
  ) => Promise<Partial<PublicEmployerUser> | null>;
  login: (
    email: string,
    password: string
  ) => Promise<Partial<PublicEmployerUser> | null>;
  email_status: (
    email: string
  ) => Promise<{ existing_user: boolean; verified_user: boolean }>;
  logout: () => Promise<void>;
  is_authenticated: () => boolean;
  refresh_authentication: () => void;
  redirect_if_not_logged_in: () => void;
  redirect_if_logged_in: () => void;
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
  const [is_loading, set_is_loading] = useState(true);
  const [is_authenticated, set_is_authenticated] = useState(() => {
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

    if (is_authenticated)
      sessionStorage.setItem("isAuthenticated", JSON.stringify(true));
    else sessionStorage.removeItem("isAuthenticated");
  }, [user, is_authenticated]);

  const refresh_authentication =
    async (): Promise<Partial<PublicEmployerUser> | null> => {
      const response = await employer_auth_service.loggedin();

      if (!response.success) {
        set_is_loading(false);
        return null;
      }

      setUser(response.user as PublicEmployerUser);
      set_is_authenticated(true);
      set_is_loading(false);
      return response.user as PublicEmployerUser;
    };

  const login = async (email: string, password: string) => {
    const response = await employer_auth_service.login(email, password);
    if (!response.success) return null;

    setUser(response.user as PublicEmployerUser);
    set_is_authenticated(true);

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
    setGod(false);
    set_is_authenticated(false);
  };

  const redirect_if_not_logged_in = () =>
    useEffect(() => {
      if (!is_loading && !is_authenticated) router.push("/login");
    }, [is_authenticated, is_loading]);

  const redirect_if_logged_in = () =>
    useEffect(() => {
      if (!is_loading && is_authenticated) router.push("/dashboard");
    }, [is_authenticated, is_loading]);

  useEffect(() => {
    refresh_authentication();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        god,
        // @ts-ignore
        login,
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
