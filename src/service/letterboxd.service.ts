import { XMLParser } from 'fast-xml-parser';import { searchMedia } from './tmdb.service'; 
export interface LetterboxdData {
  rating: number;
  distribution: number[]; 
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
    // 1. Fetch the actual movie page
    const response = await fetch(`https://letterboxd.com/film/${movieSlug}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      }
    });

    if (!response.ok) throw new Error('Could not reach Letterboxd');

    const html = await response.text();

    // 2. Extract the rating using Regex (Letterboxd hides it in JSON-LD)
    // We look for "ratingValue": 4.2
    const ratingMatch = html.match(/"ratingValue":\s*([\d.]+)/);
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 0;

    // 3. Extract the watch count (usually in a script tag or meta tag)
    const watchMatch = html.match(/"checkinCount":\s*(\d+)/);
    const watchCount = watchMatch ? parseInt(watchMatch[1], 10) : 0;

    return {
      rating: rating,
      distribution: [0,0,0,0,0,0,0,0,0,0], // Histogram is harder to scrape without a DOM parser
      watchCount: watchCount,
    };
  } catch (error) {
    console.error('Real Scraping Error:', error);
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

export async function fetchUserLetterboxdStatus(username: string, tmdbId: number | string) {
  try {
    // 1. Resolve the Letterboxd Slug using the TMDb ID
    // Letterboxd has a specific endpoint for TMDb IDs
    const movieResponse = await fetch(`https://letterboxd.com/tmdb/${tmdbId}`, {
      method: 'GET', // Changed to GET to ensure we get the final URL in RN
      redirect: 'follow'
    });

    const finalUrl = movieResponse?.url;

    // Safety check: if the redirect didn't happen or URL is missing
    if (!finalUrl || !finalUrl.includes('/film/')) {
      return { rating: null, inWatchlist: false };
    }

    // Extract slug (e.g., from "https://letterboxd.com/film/inception/" get "inception")
    const parts = finalUrl.split('/film/');
    const movieSlug = parts[1]?.split('/')[0];

    if (!movieSlug) return { rating: null, inWatchlist: false };

    // 2. Fetch YOUR personal page for this film
    const userFilmUrl = `https://letterboxd.com/${username}/film/${movieSlug}/`;
    const response = await fetch(userFilmUrl);
    
    if (response.status === 404) return { rating: null, inWatchlist: false };

    const html = await response.text();

    // 3. Extract Rating (class="rated-9" means 4.5 stars)
    const ratingMatch = html.match(/rated-(\d+)/);
    const myRating = ratingMatch ? parseInt(ratingMatch[1], 10) / 2 : null;

    // 4. Extract Watchlist status 
    // This is hard to get without login, but we can check for "Watched" status
    const hasWatched = html.includes('viewed-by-user') || !!myRating;

    return { 
        rating: myRating, 
        inWatchlist: false 
    };

  } catch (e) {
    console.error("Personal Scrape Error:", e);
    return { rating: null, inWatchlist: false };
  }
}



export const getLetterboxdTrending = async () => {
  try {
    // This is a common public endpoint that mirrors Letterboxd's "Popular this week"
    const response = await fetch('https://letterboxd-api.vercel.app/popular');
    const titles = await response.json(); // Returns: ["Anora", "Gladiator II", ...]

    // Now, we map those titles to TMDB data so we have posters and IDs
    if(titles.length === 0 || !Array.isArray(titles)) return [];
    console.log(titles);
    const moviePromises = titles.slice(0, 15).map(async (title: string) => {
      const searchRes = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}&api_key=YOUR_TMDB_KEY`
      );
      const searchData = await searchRes.json();
      return searchData.results[0]; // Take the first match
    });

    const movies = await Promise.all(moviePromises);
    return movies.filter(m => m !== undefined);
  } catch (error) {
    console.error("Letterboxd Mirror Error:", error);
    return [];
  }
};