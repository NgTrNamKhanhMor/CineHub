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
export const getIMDbDistribution = async (imdbId: string): Promise<number[]> => {
  try {
    const url = `https://www.imdb.com/title/${imdbId}/ratings/`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      }
    });

    const html = await response.text();

    const scriptSelector = /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s;
    const jsonMatch = html.match(scriptSelector);

    if (!jsonMatch) {
      console.warn("IMDb: __NEXT_DATA__ not found. Likely blocked by bot protection.");
      return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    const fullData = JSON.parse(jsonMatch[1]);

    const rawValues = fullData.props.pageProps.contentData.histogramData.histogramValues;

    const distribution = new Array(10).fill(0);
    
    rawValues.forEach((item: { rating: number; count: number }) => {
      if (item.rating >= 1 && item.rating <= 10) {
        distribution[item.rating - 1] = item.count;
      }
    });

    return distribution;

  } catch (error) {
    console.error('Critical Error scraping IMDb:', error);
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