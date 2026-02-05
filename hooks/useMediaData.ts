// hooks/useMediaData.ts
// Custom React hook for fetching media data with loading and error states

import { useState, useEffect } from 'react';
import { fetchMediaData, MediaData } from '../service/media.service';

export interface UseMediaDataReturn {
  data: MediaData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch media data
 * @param tmdbId - The TMDb ID of the movie or TV show
 * @param type - Either 'movie' or 'tv'
 */
export const useMediaData = (
  tmdbId: number | null,
  type: 'movie' | 'tv'
): UseMediaDataReturn => {
  const [data, setData] = useState<MediaData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!tmdbId) return;

    setLoading(true);
    setError(null);

    try {
      const mediaData = await fetchMediaData(tmdbId, type);
      setData(mediaData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error in useMediaData:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tmdbId, type]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};