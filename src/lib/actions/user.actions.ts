'use server';

import {
    ApiResponse,
    EmailChangeRequest,
    ProfileUpdateData,
    User,
    UserRole
} from '@/types';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// For server-side actions, use INTERNAL_API_URL (Docker network) if available
// Otherwise fall back to NEXT_PUBLIC_API_URL
const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getAuthHeaders() {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
}

export async function getCurrentUser(): Promise<User | null> {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/users/profile/me`, {
            headers,
            credentials: 'include',
            cache: 'no-store',
        });

        if (!res.ok) return null;

        const data: ApiResponse<User> = await res.json();
        return data.data || null;
    } catch (error) {
        console.error('Get current user error:', error);
        return null;
    }
}

export async function updateProfileAction(formData: FormData) {
    const name = formData.get('name') as string;
    const contactNumber = formData.get('contactNumber') as string;

    const updateData: ProfileUpdateData = {};
    if (name) updateData.name = name;
    if (contactNumber) updateData.contactNumber = contactNumber;

    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/users/profile/me`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(updateData),
            credentials: 'include',
        });

        const data: ApiResponse<User> = await res.json();

        if (!res.ok) {
            return { success: false, message: data.message || 'Update failed' };
        }

        revalidatePath('/dashboard');
        return { success: true, message: data.message, user: data.data };
    } catch (error) {
        console.error('Update profile error:', error);
        return { success: false, message: 'Network error. Please try again.' };
    }
}

export async function updatePasswordAction(formData: FormData) {
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;

    // Note: Backend doesn't validate current password in the update profile endpoint
    // It just updates the password field. Consider adding current password validation.
    const updateData = {
        password: newPassword,
    };

    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/users/profile/me`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(updateData),
            credentials: 'include',
        });

        const data: ApiResponse = await res.json();

        if (!res.ok) {
            return { success: false, message: data.message || 'Password update failed' };
        }

        return { success: true, message: data.message || 'Password updated successfully' };
    } catch (error) {
        console.error('Update password error:', error);
        return { success: false, message: 'Network error. Please try again.' };
    }
}

export async function requestEmailChangeAction(formData: FormData) {
    const newEmail = formData.get('newEmail') as string;
    const password = formData.get('password') as string;

    const requestData: EmailChangeRequest = {
        newEmail,
        password,
    };

    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/users/profile/email/request`, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestData),
            credentials: 'include',
        });

        const data: ApiResponse = await res.json();

        if (!res.ok) {
            return { success: false, message: data.message || 'Email change request failed' };
        }

        return { success: true, message: data.message };
    } catch (error) {
        console.error('Request email change error:', error);
        return { success: false, message: 'Network error. Please try again.' };
    }
}

export async function verifyEmailChangeAction(
    newEmail: string,
    otp: string,
) {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/users/profile/email/verify`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ newEmail, otp }),
            credentials: 'include',
        });

        const data: ApiResponse<User> = await res.json();

        if (!res.ok) {
            return { success: false, message: data.message || 'Email verification failed' };
        }

        revalidatePath('/dashboard');
        return { success: true, message: data.message, user: data.data };
    } catch (error) {
        console.error('Verify email change error:', error);
        return { success: false, message: 'Network error. Please try again.' };
    }
}

export async function getAllUsers(): Promise<User[]> {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/users`, {
            headers,
            credentials: 'include',
            cache: 'no-store',
        });

        if (!res.ok) return [];

        const data: ApiResponse<User[]> = await res.json();
        return data.data || [];
    } catch (error) {
        console.error('Get all users error:', error);
        return [];
    }
}

export async function changeUserRoleAction(userId: string, newRole: UserRole) {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/users/${userId}/role`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ newRole }),
            credentials: 'include',
        });

        const data: ApiResponse<User> = await res.json();

        if (!res.ok) {
            return { success: false, message: data.message || 'Role change failed' };
        }

        revalidatePath('/dashboard/admin');
        return { success: true, message: data.message, user: data.data };
    } catch (error) {
        console.error('Change user role error:', error);
        return { success: false, message: 'Network error. Please try again.' };
    }
}

export async function deleteUserAction(userId: string) {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE',
            headers,
            credentials: 'include',
        });

        const data: ApiResponse = await res.json();

        if (!res.ok) {
            return { success: false, message: data.message || 'Delete user failed' };
        }

        revalidatePath('/dashboard/admin');
        return { success: true, message: data.message };
    } catch (error) {
        console.error('Delete user error:', error);
        return { success: false, message: 'Network error. Please try again.' };
    }
}
