import { describe, it, expect } from 'vitest';
import { supabase } from '../supabase';

describe('Supabase Client', () => {
  it('should initialize Supabase client', () => {
    expect(supabase).toBeDefined();
  });

  it('should have required methods', () => {
    expect(supabase.from).toBeDefined();
    expect(supabase.auth).toBeDefined();
  });
});
