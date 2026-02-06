// services/tmdb.service.ts
// TMDb API Service - Primary data source for movies and TV shows

import { API_CONFIG } from "../config/env";


const TMDB_API_KEY = API_CONFIG.TMDB_API_KEY;
const TMDB_BASE_URL = API_CONFIG.TMDB_BASE_URL;
const TMDB_IMAGE_BASE_URL = API_CONFIG.TMDB_IMAGE_BASE_URL;

export interface TMDbMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  runtime: number;
  poster_path: string;
  vote_average: number;
  imdb_id?: string;
}

export interface TMDbTVShow {
  id: number;
  name: string;
  overview: string;
  first_air_date: string;
  episode_run_time: number[];
  poster_path: string;
  vote_average: number;
  number_of_seasons: number;
}

export interface TMDbEpisode {
  season_number: number;
  episode_number: number;
  name: string;
  vote_average: number;
  air_date: string;
}

/**
 * Search for movies or TV shows
 */
export const searchMedia = async (
  query: string,
  type: 'movie' | 'tv' = 'movie'
): Promise<any[]> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`
    );
    console.log(response)
    
    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching TMDb:', error);
    throw error;
  }
};

/**
 * Get detailed movie information
 */
export const getMovieDetails = async (movieId: number): Promise<TMDbMovie> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    
    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

/**
 * Get detailed TV show information
 */
export const getTVShowDetails = async (tvId: number): Promise<TMDbTVShow> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${tvId}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    
    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching TV show details:', error);
    throw error;
  }
};

/**
 * Get all episodes for a TV show season
 */
export const getSeasonEpisodes = async (
  tvId: number,
  seasonNumber: number
): Promise<TMDbEpisode[]> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    
    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.episodes || [];
  } catch (error) {
    console.error('Error fetching season episodes:', error);
    throw error;
  }
};

/**
 * Get all episodes for entire TV series
 */
export const getAllTVEpisodes = async (
  tvId: number,
  numberOfSeasons: number
): Promise<TMDbEpisode[]> => {
  try {
    const allEpisodes: TMDbEpisode[] = [];
    
    // Fetch all seasons in parallel
    const seasonPromises = Array.from({ length: numberOfSeasons }, (_, i) =>
      getSeasonEpisodes(tvId, i + 1)
    );
    
    const seasonsData = await Promise.all(seasonPromises);
    
    seasonsData.forEach((episodes) => {
      allEpisodes.push(...episodes);
    });
    
    return allEpisodes;
  } catch (error) {
    console.error('Error fetching all TV episodes:', error);
    throw error;
  }
};

/**
 * Get full poster URL
 */
export const getPosterUrl = (posterPath: string | null): string => {
  if (!posterPath) {
    return 'https://via.placeholder.com/500x750?text=No+Poster';
  }
  return `${TMDB_IMAGE_BASE_URL}${posterPath}`;
};

/**
 * Get external IDs (IMDb ID, etc.)
 */
export const getMovieExternalIds = async (movieId: number): Promise<{ imdb_id: string }> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/external_ids?api_key=${TMDB_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching external IDs:', error);
    throw error;
  }
};

export const getTVExternalIds = async (tvId: number): Promise<{ imdb_id: string }> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${tvId}/external_ids?api_key=${TMDB_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching TV external IDs:', error);
    throw error;
  }
};