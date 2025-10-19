'use server';

import { AuthResponse } from '@/types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function loginAction(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data: AuthResponse = await res.json();

        if (!res.ok) {
            return { success: false, message: data.message || 'Login failed' };
        }

        if (data.accessToken && data.refreshToken) {
            const cookieStore = await cookies();

            cookieStore.set('accessToken', data.accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/',
                maxAge: 24 * 60 * 60,
            });

            cookieStore.set('refreshToken', data.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/',
                maxAge: 7 * 24 * 60 * 60,
            });
        }

        return { success: true, message: data.message, user: data.user };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Network error. Please try again.' };
    }
}

export async function signupAction(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const contactNumber = formData.get('contactNumber') as string;

    try {
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, contactNumber }),
        });

        const data: AuthResponse = await res.json();

        if (!res.ok) {
            return { success: false, message: data.message || 'Signup failed' };
        }

        if (data.userId && data.email) {
            const cookieStore = await cookies();

            const verificationToken = Buffer.from(`${data.userId}:${data.email}:${Date.now()}`).toString('base64');

            cookieStore.set('otpVerificationToken', verificationToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/',
                maxAge: 10 * 60,
            });
        }

        return {
            success: true,
            message: data.message,
            userId: data.userId,
            email: data.email,
        };
    } catch (error) {
        console.error('Signup error:', error);
        return { success: false, message: 'Network error. Please try again.' };
    }
}

export async function verifyOtpAction(
    userId: string,
    email: string,
    otp: string,
) {
    try {
        const res = await fetch(`${API_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, email, otp }),
            credentials: 'include',
        });

        const data: AuthResponse = await res.json();

        if (!res.ok) {
            return { success: false, message: data.message || 'OTP verification failed' };
        }

        if (data.accessToken && data.refreshToken) {
            const cookieStore = await cookies();

            cookieStore.set('accessToken', data.accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/',
                maxAge: 24 * 60 * 60,
            });

            cookieStore.set('refreshToken', data.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/',
                maxAge: 7 * 24 * 60 * 60,
            });

            cookieStore.delete('otpVerificationToken');
        }

        return { success: true, message: data.message, user: data.user };
    } catch (error) {
        console.error('OTP verification error:', error);
        return { success: false, message: 'Network error. Please try again.' };
    }
}

export async function resendOtpAction(userId: string, email: string) {
    try {
        const res = await fetch(`${API_URL}/auth/resend-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, email }),
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, message: data.message || 'Failed to resend OTP' };
        }

        return { success: true, message: data.message };
    } catch (error) {
        console.error('Resend OTP error:', error);
        return { success: false, message: 'Network error. Please try again.' };
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    redirect('/login');
}

export async function getAuthToken() {
    const cookieStore = await cookies();
    return cookieStore.get('accessToken')?.value;
}
