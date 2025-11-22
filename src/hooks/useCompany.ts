import { useState, useEffect } from 'react';
import { getCompanyByUserId, createCompany, updateCompany } from '../services/companyService';
import { useAuth } from './useAuth';
import type { Company } from '../types';

export function useCompany() {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadCompany() {
      if (!user?.id) {
        if (mounted) setIsLoading(false);
        return;
      }

      if (mounted) {
        setIsLoading(true);
        setError(null);
      }

      const result = await getCompanyByUserId(user.id);
      
      if (mounted) {
        if (result.error) {
          setError(result.error);
        } else {
          setCompany(result.data || null);
        }
        setIsLoading(false);
      }
    }

    loadCompany();

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const create = async (data: Omit<Company, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user?.id) {
      setError('User not authenticated');
      return { error: 'User not authenticated' };
    }

    const result = await createCompany({ ...data, recruiter_id: user.id });
    if (result.error) {
      setError(result.error);
      return { error: result.error };
    }

    setCompany(result.data);
    return { error: null };
  };

  const update = async (id: string, updates: Partial<Company>) => {
    const result = await updateCompany(id, updates);
    if (result.error) {
      setError(result.error);
      return { error: result.error };
    }

    setCompany(result.data);
    return { error: null };
  };

  return {
    company,
    isLoading,
    error,
    create,
    update,
  };
}
