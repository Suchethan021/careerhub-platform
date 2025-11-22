import { supabase } from './supabase';
import type { User, ApiResponse } from '../types';
import { createApiError } from '../types';

export async function login(email: string, password: string): Promise<ApiResponse<User>> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user data returned');

    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      created_at: data.user.created_at,
    };

    return { data: user, error: null };
  } catch (err) {
    const apiError = createApiError(err);
    return { data: null, error: apiError.message };
  }
}

export async function requestPasswordReset(email: string): Promise<ApiResponse<void>> {
  try {
    // Supabase will send a magic link that creates a temporary recovery
    // session and then redirects back to this SPA. We point it at
    // /reset-password so the user can actually set a new password.
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    if (error) throw error;

    return { data: null, error: null };
  } catch (err) {
    const apiError = createApiError(err);
    return { data: null, error: apiError.message };
  }
}

export async function updatePassword(newPassword: string): Promise<ApiResponse<void>> {
  try {
    // After arriving from the recovery link, Supabase has an active
    // session for this user, so updateUser will apply the new password.
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) throw error;

    return { data: null, error: null };
  } catch (err) {
    const apiError = createApiError(err);
    return { data: null, error: apiError.message };
  }
}

export async function signup(email: string, password: string): Promise<ApiResponse<User>> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user data returned');

    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      created_at: data.user.created_at,
    };

    return { data: user, error: null };
  } catch (err) {
    const apiError = createApiError(err);
    return { data: null, error: apiError.message };
  }
}

export async function logout(): Promise<ApiResponse<void>> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { data: null, error: null };
  } catch (err) {
    const apiError = createApiError(err);
    return { data: null, error: apiError.message };
  }
}

export async function getCurrentUser(): Promise<ApiResponse<User>> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) throw error;
    if (!user) return { data: null, error: 'No authenticated user' };

    const userData: User = {
      id: user.id,
      email: user.email!,
      created_at: user.created_at,
    };

    return { data: userData, error: null };
  } catch (err) {
    const apiError = createApiError(err);
    return { data: null, error: apiError.message };
  }
}
