import { supabase } from './supabase';
import type { AuthUser, ApiResponse, ApiError } from '../types';

// ============================================================================
// SIGNUP
// ============================================================================

export async function signup(email: string, password: string): Promise<ApiResponse<AuthUser>> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      return { data: null, error: error.message };
    }

    if (!data.user) {
      return { data: null, error: 'User creation failed' };
    }

    return {
      data: {
        id: data.user.id,
        email: data.user.email ?? '',
        email_confirmed_at: data.user.email_confirmed_at ?? null,
        user_metadata: data.user.user_metadata ?? null,
        created_at: data.user.created_at,
        updated_at: data.user.updated_at
      },
      error: null
    };
  } catch (err) {
    const error = err as ApiError;
    return { data: null, error: error.message || 'Signup failed' };
  }
}

// ============================================================================
// LOGIN
// ============================================================================

export async function login(email: string, password: string): Promise<ApiResponse<AuthUser>> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { data: null, error: error.message };
    }

    if (!data.user) {
      return { data: null, error: 'Login failed' };
    }

    return {
      data: {
        id: data.user.id,
        email: data.user.email ?? '',
        email_confirmed_at: data.user.email_confirmed_at ?? null,
        user_metadata: data.user.user_metadata ?? null,
        created_at: data.user.created_at,
        updated_at: data.user.updated_at
      },
      error: null
    };
  } catch (err) {
    const error = err as ApiError;
    return { data: null, error: error.message || 'Login failed' };
  }
}

// ============================================================================
// LOGOUT
// ============================================================================

export async function logout(): Promise<ApiResponse<null>> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: null, error: null };
  } catch (err) {
    const error = err as ApiError;
    return { data: null, error: error.message || 'Logout failed' };
  }
}

// ============================================================================
// GET CURRENT USER
// ============================================================================

export async function getCurrentUser(): Promise<ApiResponse<AuthUser>> {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      return { data: null, error: error.message };
    }

    if (!data.user) {
      return { data: null, error: 'No user logged in' };
    }

    return {
      data: {
        id: data.user.id,
        email: data.user.email ?? '',
        email_confirmed_at: data.user.email_confirmed_at ?? null,
        user_metadata: data.user.user_metadata ?? null,
        created_at: data.user.created_at,
        updated_at: data.user.updated_at
      },
      error: null
    };
  } catch (err) {
    const error = err as ApiError;
    return { data: null, error: error.message || 'Failed to get user' };
  }
}
