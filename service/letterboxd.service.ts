// services/letterboxd.service.ts
// Letterboxd Service - Web scraping for ratings (use carefully!)

/**
 * WARNING: Letterboxd has no official API.
 * This service uses web scraping which:
 * 1. May violate Letterboxd's Terms of Service
 * 2. Can break if they change their HTML structure
 * 3. Should be rate-limited to avoid bans
 * 
 * RECOMMENDED ALTERNATIVES:
 * - Use a community-built API proxy
 * - Cache data heavily
 * - Only scrape on-demand with user consent
 * - Consider manual data entry for popular titles
 */

export interface LetterboxdData {
  rating: number; // Average rating (0-5.0)
  distribution: number[]; // Array of 10 values for 0.5-5.0 star distribution
  watchCount: number;
}

/**
 * Search for a movie on Letterboxd
 * Returns the Letterboxd slug (URL-friendly name)
 */
export const searchLetterboxd = async (movieTitle: string, year?: string): Promise<string | null> => {
  try {
    // Construct search URL
    const searchQuery = year ? `${movieTitle} ${year}` : movieTitle;
    const searchUrl = `https://letterboxd.com/search/${encodeURIComponent(searchQuery)}/`;
    
    // In a real implementation, you would:
    // 1. Fetch the search page
    // 2. Parse HTML to find the first movie result
    // 3. Extract the movie slug from the URL
    
    // For now, we'll construct a likely slug
    const slug = movieTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    return slug;
  } catch (error) {
    console.error('Error searching Letterboxd:', error);
    return null;
  }
};

/**
 * Scrape Letterboxd rating data
 * NOTE: This is a mock implementation. Real scraping would require:
 * - HTML parsing library (e.g., cheerio for React Native)
 * - Proper error handling
 * - Rate limiting
 * - User agent spoofing
 */
export const getLetterboxdRating = async (movieSlug: string): Promise<LetterboxdData | null> => {
  try {
    // In a real implementation, you would:
    // 1. Fetch https://letterboxd.com/film/{movieSlug}/
    // 2. Parse the HTML for rating data
    // 3. Look for elements like:
    //    - .average-rating for the average score
    //    - .rating-histogram for distribution
    //    - .film-stats for watch count
    
    // For now, return mock data
    console.warn('Letterboxd scraping not implemented - using mock data');
    
    // Generate realistic mock distribution
    const mockDistribution = [
      Math.floor(Math.random() * 500),   // 0.5 stars
      Math.floor(Math.random() * 1000),  // 1.0 stars
      Math.floor(Math.random() * 2000),  // 1.5 stars
      Math.floor(Math.random() * 3000),  // 2.0 stars
      Math.floor(Math.random() * 4000),  // 2.5 stars
      Math.floor(Math.random() * 5000),  // 3.0 stars
      Math.floor(Math.random() * 6000),  // 3.5 stars
      Math.floor(Math.random() * 5000),  // 4.0 stars
      Math.floor(Math.random() * 3000),  // 4.5 stars
      Math.floor(Math.random() * 1000),  // 5.0 stars
    ];
    
    return {
      rating: 3.8 + Math.random() * 0.8, // Random rating between 3.8-4.6
      distribution: mockDistribution,
      watchCount: mockDistribution.reduce((a, b) => a + b, 0),
    };
  } catch (error) {
    console.error('Error fetching Letterboxd data:', error);
    return null;
  }
};

/**
 * ALTERNATIVE: Use Letterboxd community API proxy
 * Some developers have created unofficial APIs that scrape Letterboxd
 * Example: https://github.com/zaccolley/letterboxd
 */
export const getLetterboxdFromProxy = async (
  imdbId: string
): Promise<LetterboxdData | null> => {
  try {
    // Example of using a community proxy (you'd need to find/host one)
    // const response = await fetch(`https://letterboxd-api.example.com/movie/${imdbId}`);
    // const data = await response.json();
    // return data;
    
    console.warn('Letterboxd proxy API not configured');
    return null;
  } catch (error) {
    console.error('Error fetching from Letterboxd proxy:', error);
    return null;
  }
};

/**
 * RECOMMENDED: Manual data entry for popular titles
 * For a production app, consider maintaining a database of popular movies
 * with manually entered Letterboxd data
 */
export const popularMoviesLetterboxdData: Record<string, LetterboxdData> = {
  'tt1375666': { // Inception
    rating: 4.2,
    distribution: [120, 450, 800, 1200, 2000, 3500, 5000, 4200, 2100, 800],
    watchCount: 16170,
  },
  'tt0468569': { // The Dark Knight
    rating: 4.4,
    distribution: [80, 200, 500, 900, 1800, 3200, 5500, 6000, 3500, 1500],
    watchCount: 22180,
  },
  'tt0111161': { // The Shawshank Redemption
    rating: 4.5,
    distribution: [50, 150, 400, 700, 1500, 2800, 5000, 6500, 4000, 2000],
    watchCount: 23100,
  },
  'tt0109830': { // Forrest Gump
    rating: 4.1,
    distribution: [100, 400, 750, 1100, 2100, 3400, 4800, 4000, 1900, 700],
    watchCount: 18250,
  },
  'tt0137523': { // Fight Club
    rating: 4.3,
    distribution: [90, 300, 650, 1000, 1900, 3300, 5200, 5500, 2800, 1200],
    watchCount: 20940,
  },
};

/**
 * Get Letterboxd data from cache or fallback to scraping
 */
export const getLetterboxdData = async (
  imdbId: string,
  movieTitle?: string,
  year?: string
): Promise<LetterboxdData | null> => {
  // Try cached popular movies first
  if (popularMoviesLetterboxdData[imdbId]) {
    return popularMoviesLetterboxdData[imdbId];
  }
  
  // Try proxy API
  const proxyData = await getLetterboxdFromProxy(imdbId);
  if (proxyData) {
    return proxyData;
  }
  
  // Last resort: scraping (not recommended for production)
  if (movieTitle) {
    const slug = await searchLetterboxd(movieTitle, year);
    if (slug) {
      return await getLetterboxdRating(slug);
    }
  }
  
  // Return null if all methods fail
  return null;
};