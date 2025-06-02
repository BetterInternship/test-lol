'use client'

import { User } from '@/lib/api-client';
import { auth_service } from '@/lib/api';
import React, { createContext, useState, useContext, useEffect } from 'react';

interface IAuthContext {
	user: Partial<User> | null,
	isAuthenticated: boolean,
	login: (user: Partial<User>) => Promise<{ token: string, user: Partial<User> }>,
	register: (user: Partial<User>) => Promise<{ token: string, user: Partial<User> }>,
	verify: (user_id: string, key: string) => Promise<{ token: string, user: Partial<User> }>,
	send_otp_request: (email: string) => Promise<{ email: string }>,
	verify_otp: (email: string, otp: string) => Promise<{ token: string, user: Partial<User> }>,
	email_status: (email: string) => Promise<{ existing_user: boolean, verified_user: boolean }>,
	logout: (user: Partial<User>) => void,
	is_authenticated: () => boolean,
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(() => {
		if (typeof window === 'undefined') return false;
		const isAuthed = sessionStorage.getItem('isAuthenticated')
		return isAuthed ? JSON.parse(isAuthed) : false;
	});
	const [user, setUser] = useState<Partial<User> | null>(() => {
		if (typeof window === 'undefined') return null;
		const user = sessionStorage.getItem('user')
		return user ? JSON.parse(user) : null;
	});

	// Whenever user is updated, cache in localStorage
	useEffect(() => {
    if (user) sessionStorage.setItem('user', JSON.stringify(user));
    else sessionStorage.removeItem('user');
		
		if(isAuthenticated) sessionStorage.setItem('isAuthenticated', JSON.stringify(true))
		else sessionStorage.removeItem('isAuthenticated');
  }, [user, isAuthenticated]);

	const register = async (user: Partial<User>) => {
		const response = await auth_service.register(user);
		if (response.token) {
			setUser(response.user)
			setIsAuthenticated(true)
			AuthContextTokenStore.set(response.token)
		}
		return response;
	}

	const login = async (user: Partial<User>) => {
		const response = await auth_service.login(user.email ?? '', '');
		if (response.token) {
			setUser(response.user)
			setIsAuthenticated(true)
			AuthContextTokenStore.set(response.token)
		}
		return response;
	}

	const verify = async (user_id: string, key: string) => {
		const response = await auth_service.verify(user_id, key);
		if (response.token) {
			setUser(response.user)
			setIsAuthenticated(true)
			AuthContextTokenStore.set(response.token)
		}
		return response;
	}	

	const send_otp_request = async (email: string) => {
		const response = await auth_service.send_otp_request(email);
		return response;
	}

	const verify_otp = async (email: string, otp: string) => {
		const response = await auth_service.verify_otp(email, otp);
		if (response.token) {
			setUser(response.user)
			setIsAuthenticated(true)
			AuthContextTokenStore.set(response.token)
		}
		return response;
	}

	const email_status = async (email: string) => {
		const response = await auth_service.email_status(email);
		return response;
	}

	const logout = (user: Partial<User>) => {
		auth_service.logout()
    setUser(null)
    setIsAuthenticated(false)
	}

	const is_authenticated = () => {
		return isAuthenticated;
	}

	return (
		<AuthContext.Provider value={{ user, isAuthenticated, register, login, verify, send_otp_request: send_otp_request, verify_otp, email_status, logout, is_authenticated }}>
			{ children }
		</AuthContext.Provider>
	)
}

// Auth token management
export const AuthContextTokenStore = {
  get: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken')
    }
    return null
  },
  set: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token)
    }
  },
  remove: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
    }
  },
}