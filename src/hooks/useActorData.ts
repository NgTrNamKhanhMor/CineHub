import { useState, useEffect } from 'react';
import {  getPersonProfile } from '../service/media.service';
import {  PersonProfileData } from '../types';

export interface UseMediaDataReturn {
  data: PersonProfileData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}


export const useActorData = (
  personId: number | null
): UseMediaDataReturn => {
  const [data, setData] = useState<PersonProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!personId) return;

    setLoading(true);
    setError(null);

    try {
    const result = await getPersonProfile(personId);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error in useActorData:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [personId]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};