'use client'

import { PublicUser } from '@/lib/db/db.types';
import { auth_service } from '@/lib/api';
import React, { createContext, useState, useContext, useEffect } from 'react';

interface IAuthContext {
	user: Partial<PublicUser> | null,
	recheck_authentication: () => Promise<Partial<PublicUser | null>>,
	register: (user: Partial<PublicUser>) => Promise<Partial<PublicUser> | null>,
	verify: (user_id: string, key: string) => Promise<Partial<PublicUser> | null>,
	send_otp_request: (email: string) => Promise<{ email: string }>,
	resend_otp_request: (email: string) => Promise<{ email: string }>
	verify_otp: (email: string, otp: string) => Promise<Partial<PublicUser> | null>,
	email_status: (email: string) => Promise<{ existing_user: boolean, verified_user: boolean }>,
	logout: (user: Partial<PublicUser>) => void,
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
	const [user, setUser] = useState<Partial<PublicUser> | null>(() => {
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

	const recheck_authentication = async () => {
		const response = await auth_service.loggedin();
		if (!response.success) return null;
		
		setUser(response.user)
		setIsAuthenticated(true)
		return response.user;	
	}

	const prompt_login = async () => {
		const response = await auth_service.loggedin();
		if (!response.success) return true;
	}

	const register = async (user: Partial<PublicUser>) => {
		const response = await auth_service.register(user);
		if (!response.success) return null;
		
		setUser(response.user)
		setIsAuthenticated(true)
		return response;	
	}

	const verify = async (user_id: string, key: string) => {
		const response = await auth_service.verify(user_id, key);
		if (!response.success) return null;

		setUser(response.user)
		setIsAuthenticated(true)
		return response;
	}	

	const send_otp_request = async (email: string) => {
		const response = await auth_service.send_otp_request(email);
		return response;
	}

	const resend_otp_request = async (email: string) => {
		const response = await auth_service.send_otp_request(email);
		return response;
	}

	const verify_otp = async (email: string, otp: string) => {
		const response = await auth_service.verify_otp(email, otp);
		if (!response.success) return null;
		
		setUser(response.user)
		setIsAuthenticated(true)
		return response;	
	}

	const email_status = async (email: string) => {
		const response = await auth_service.email_status(email);
		return response;
	}

	const logout = (user: Partial<PublicUser>) => {
		auth_service.logout()
    setUser(null)
    setIsAuthenticated(false)
	}

	const is_authenticated = () => {
		return isAuthenticated;
	}

	return (
		<AuthContext.Provider value={{ user, recheck_authentication, register, verify, send_otp_request, resend_otp_request, verify_otp, email_status, logout, is_authenticated }}>
			{ children }
		</AuthContext.Provider>
	)
}
