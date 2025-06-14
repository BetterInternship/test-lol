'use client'

import { PublicEmployerUser } from '@/lib/db/db.types';
import { auth_service } from '@/lib/api';
import React, { createContext, useState, useContext, useEffect } from 'react';

interface IAuthContext {
	user: Partial<PublicEmployerUser> | null,
	recheck_authentication: () => Promise<Partial<PublicEmployerUser | null>>,
	register: (user: Partial<PublicEmployerUser>) => Promise<Partial<PublicEmployerUser> | null>,
	verify: (user_id: string, key: string) => Promise<Partial<PublicEmployerUser> | null>,
	send_otp_request: (email: string) => Promise<{ email: string }>,
	resend_otp_request: (email: string) => Promise<{ email: string }>
	verify_otp: (email: string, otp: string) => Promise<Partial<PublicEmployerUser> | null>,
	email_status: (email: string) => Promise<{ existing_user: boolean, verified_user: boolean }>,
	logout: () => Promise<void>,
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
	const [user, setUser] = useState<Partial<PublicEmployerUser> | null>(() => {
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

	const recheck_authentication = async (): Promise<Partial<PublicEmployerUser> | null> => {
		const response = await auth_service.employer.loggedin();
		if (!response.success) return null;
		
		setUser(response.user as PublicEmployerUser)
		setIsAuthenticated(true)
		return response.user as PublicEmployerUser;	
	}

	const send_otp_request = async (email: string) => {
		const response = await auth_service.employer.send_otp_request(email);
		return response;
	}

	const resend_otp_request = async (email: string) => {
		const response = await auth_service.employer.send_otp_request(email);
		return response;
	}

	const verify_otp = async (email: string, otp: string) => {
		const response = await auth_service.employer.verify_otp(email, otp);
		if (!response.success) return null;
		
		setUser(response.user as PublicEmployerUser)
		setIsAuthenticated(true)
		return response;	
	}

	const email_status = async (email: string) => {
		const response = await auth_service.employer.email_status(email);
		return response;
	}

	const logout = async () => {
		auth_service.employer.logout()
		setUser(null)
		setIsAuthenticated(false)
	}

	const is_authenticated = () => {
		return isAuthenticated;
	}

	return (
		// @ts-ignore
		<AuthContext.Provider value={{ user, recheck_authentication, send_otp_request, resend_otp_request, verify_otp, email_status, logout, is_authenticated }}>
			{ children }
		</AuthContext.Provider>
	)
}
