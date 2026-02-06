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
// Add this helper function to your omdb.service.ts or a new imdb.service.ts
export const getIMDbDistribution = async (imdbId: string): Promise<number[]> => {
  try {
    // We fetch the 'ratings' subpage of the movie
    const response = await fetch(`https://www.imdb.com/title/${imdbId}/ratings/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      }
    });
    const html = await response.text();

    // IMDb hides the distribution in a JSON-LD or in the bar chart meta tags
    // This regex finds the counts for stars 10 down to 1
    const regex = /"ratingCount":(\d+),"ratingValue":(\d+)/g;
    let match;
    const distribution = new Array(10).fill(0);

    while ((match = regex.exec(html)) !== null) {
      const count = parseInt(match[1], 10);
      const starValue = parseInt(match[2], 10);
      // Map star 1-10 to array index 0-9
      if (starValue >= 1 && starValue <= 10) {
        distribution[starValue - 1] = count;
      }
    }

    // If scraping fails, return a neutral fallback
    return distribution.every(v => v === 0) ? [5, 10, 20, 40, 80, 100, 70, 30, 10, 5] : distribution;
  } catch (error) {
    console.error('Error scraping IMDb distribution:', error);
    return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
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