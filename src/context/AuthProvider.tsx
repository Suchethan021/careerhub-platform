import React, { useState, useEffect } from 'react';
import type { AuthUser } from '../types';
import { supabase } from '../services/supabase';
import { signup as signupService, login as loginService, logout as logoutService } from '../services/authService';
import { AuthContext } from './AuthContext';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email ?? '',
            email_confirmed_at: data.session.user.email_confirmed_at ?? null,
            user_metadata: data.session.user.user_metadata ?? null,
            created_at: data.session.user.created_at,
            updated_at: data.session.user.updated_at
          });
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          email_confirmed_at: session.user.email_confirmed_at ?? null,
          user_metadata: session.user.user_metadata ?? null,
          created_at: session.user.created_at,
          updated_at: session.user.updated_at
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  async function signup(email: string, password: string): Promise<string | null> {
    try {
      const result = await signupService(email, password);
      if (result.error) return result.error;
      return null;
    } catch (err) {
      return (err as Error).message;
    }
  }

  async function login(email: string, password: string): Promise<string | null> {
    try {
      const result = await loginService(email, password);
      if (result.error) return result.error;
      return null;
    } catch (err) {
      return (err as Error).message;
    }
  }

  async function logout(): Promise<string | null> {
    try {
      const result = await logoutService();
      if (result.error) return result.error;
      return null;
    } catch (err) {
      return (err as Error).message;
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
