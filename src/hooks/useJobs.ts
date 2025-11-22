import { useState, useEffect } from 'react';
import { getJobs, getJobsByCompanyId, createJob, updateJob, deleteJob } from '../services/jobService';
import type { Job } from '../types';

export function useJobs(companyId?: string) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadJobs() {
      if (mounted) {
        setIsLoading(true);
        setError(null);
      }

      const result = companyId
        ? await getJobsByCompanyId(companyId)
        : await getJobs();

      if (mounted) {
        if (result.error) {
          setError(result.error);
        } else {
          setJobs(result.data || []);
        }
        setIsLoading(false);
      }
    }

    loadJobs();

    return () => {
      mounted = false;
    };
  }, [companyId]);

  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);

    const result = companyId
      ? await getJobsByCompanyId(companyId)
      : await getJobs();

    if (result.error) {
      setError(result.error);
    } else {
      setJobs(result.data || []);
    }
    setIsLoading(false);
  };

  const create = async (data: Omit<Job, 'id' | 'created_at' | 'updated_at'>) => {
    const result = await createJob(data);
    if (result.error) {
      setError(result.error);
      throw new Error(result.error);
    }

    await fetchJobs();
    return { data: result.data };
  };

  const update = async (id: string, data: Partial<Job>) => {
    const result = await updateJob(id, data);
    if (result.error) {
      setError(result.error);
      throw new Error(result.error);
    }

    await fetchJobs();
    return { data: result.data };
  };

  const remove = async (id: string) => {
    const result = await deleteJob(id);
    if (result.error) {
      setError(result.error);
      throw new Error(result.error);
    }

    await fetchJobs();
    return { data: result.data };
  };

  return {
    jobs,
    isLoading,
    error,
    create,
    update,
    remove,
    refresh: fetchJobs,
  };
}
