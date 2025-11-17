import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signup, login, logout, getCurrentUser } from '../authService';

// Mock the supabase module
vi.mock('../supabase', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn()
    }
  }
}));

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCurrentUser', () => {
    it('should return response with data or error property', async () => {
      const result = await getCurrentUser();
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('error');
    });
  });

  describe('logout', () => {
    it('should return response object', async () => {
      const result = await logout();
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('error');
    });
  });

  describe('signup', () => {
    it('should return response object', async () => {
      const result = await signup('test@example.com', 'password123');
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('error');
    });
  });

  describe('login', () => {
    it('should return response object', async () => {
      const result = await login('test@example.com', 'password123');
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('error');
    });
  });
});
