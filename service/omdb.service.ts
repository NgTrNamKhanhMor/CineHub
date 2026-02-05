import { API_CONFIG } from "../config/env";


const OMDB_API_KEY = API_CONFIG.OMDB_API_KEY;
const OMDB_BASE_URL = API_CONFIG.OMDB_BASE_URL;

export interface OMDbResponse {
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
}

/**
 * Get movie/TV data from OMDb using IMDb ID
 */
export const getIMDbRating = async (imdbId: string): Promise<number> => {
  try {
    const response = await fetch(
      `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${imdbId}&plot=short`
    );
    
    if (!response.ok) {
      throw new Error(`OMDb API error: ${response.status}`);
    }
    
    const data: OMDbResponse = await response.json();
    
    // Parse IMDb rating
    const rating = parseFloat(data.imdbRating);
    return isNaN(rating) ? 0 : rating;
  } catch (error) {
    console.error('Error fetching OMDb data:', error);
    // Return 0 if API fails - we'll fall back to TMDb rating
    return 0;
  }
};

/**
 * Get detailed ratings from multiple sources
 */
export const getDetailedRatings = async (imdbId: string): Promise<{
  imdb: number;
  rottenTomatoes?: number;
  metacritic?: number;
}> => {
  try {
    const response = await fetch(
      `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${imdbId}&plot=short`
    );
    
    if (!response.ok) {
      throw new Error(`OMDb API error: ${response.status}`);
    }
    
    const data: OMDbResponse = await response.json();
    
    const ratings: any = {
      imdb: parseFloat(data.imdbRating) || 0,
    };
    
    // Parse other ratings if available
    data.Ratings?.forEach((rating) => {
      if (rating.Source === 'Rotten Tomatoes') {
        ratings.rottenTomatoes = parseInt(rating.Value) || 0;
      } else if (rating.Source === 'Metacritic') {
        ratings.metacritic = parseInt(rating.Value) || 0;
      }
    });
    
    return ratings;
  } catch (error) {
    console.error('Error fetching detailed ratings:', error);
    return { imdb: 0 };
  }
};