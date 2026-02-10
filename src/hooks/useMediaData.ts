// hooks/useMediaData.ts
// Custom React hook for fetching media data with loading and error states

import { useState, useEffect } from 'react';
import { fetchMediaData } from '../service/media.service';
import { MediaData } from '../types';
import { fetchUserLetterboxdStatus } from '../service/letterboxd.service';

export interface UseMediaDataReturn {
  data: MediaData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  myLetterboxdStats: { rating: number | null; inWatchlist: boolean };
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
  const username = 'El_Almas'
  const [data, setData] = useState<MediaData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [myLetterboxdStats, setMyLetterboxdStats] = useState<{ rating: number | null, inWatchlist: boolean }>({
    rating: null,
    inWatchlist: false
  });

  const fetchData = async () => {
    if (!tmdbId) return;

    setLoading(true);
    setError(null);

    try {
      const mediaData = await fetchMediaData(tmdbId, type);
      setData(mediaData);
      if (username && mediaData.id) {
          // Check personal Letterboxd status
          const personalStats = await fetchUserLetterboxdStatus(username, mediaData.id);
          setMyLetterboxdStats(personalStats);
        }
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

  return { data, loading, error, refetch, myLetterboxdStats };
};