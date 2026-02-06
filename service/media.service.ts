import { MediaData, TMDbEpisode } from "../types";
import { getLetterboxdData, LetterboxdData } from "./letterboxd.service";
import { getIMDbDistribution, getIMDbRating } from "./omdb.service";
import { getAllTVEpisodes, getMovieDetails, getMovieExternalIds, getPosterUrl, getTVExternalIds, getTVShowDetails, searchMedia } from "./tmdb.service";




/**
 * Fetch complete movie data from all sources
 */
export const fetchMovieData = async (tmdbId: number): Promise<MediaData> => {
  try {
    console.log('Fetching movie data from TMDb...');
    const tmdbData = await getMovieDetails(tmdbId);
    const director = tmdbData.credits?.crew?.find(
    (person: any) => person.job === 'Director'
  )?.name;
    console.log('Fetching external IDs...');
    const externalIds = await getMovieExternalIds(tmdbId);
    const imdbId = externalIds.imdb_id;
    
    // Fetch IMDb rating (from OMDb)
    console.log('Fetching IMDb rating...');
    let imdbRating = 0;
    let imdbWeights = [0,0,0,0,0,0,0,0,0,0];
    if (imdbId) {
      imdbRating = await getIMDbRating(imdbId);
      imdbWeights = await getIMDbDistribution(imdbId);
    }
    
    // Fallback to TMDb rating if OMDb fails
    if (imdbRating === 0) {
      imdbRating = tmdbData.vote_average;
      console.log('Using TMDb rating as fallback');
    }
    
    // Fetch Letterboxd data
    console.log('Fetching Letterboxd data...');
    let letterboxdData: LetterboxdData | null = null;
    if (imdbId) {
      letterboxdData = await getLetterboxdData(
        imdbId,
        tmdbData.title,
        tmdbData.release_date?.split('-')[0]
      );
    }
    
    // Construct MediaData object
    const mediaData: MediaData = {
      title: tmdbData.title,
      summary: tmdbData.overview || 'No summary available.',
      releaseDate: tmdbData.release_date?.split('-')[0] || 'Unknown',
      runtime: tmdbData.runtime || 0,
      type: 'movie',
      posterUrl: getPosterUrl(tmdbData.poster_path),
      scores: {
        imdb: imdbRating,
        letterboxd: letterboxdData?.rating || 0,
      },
      imdbWeights: imdbWeights,
      letterboxdWeights: letterboxdData?.distribution || [],
      backdropUrl: getPosterUrl(tmdbData.backdrop_path),
       director: director || 'Unknown Director',
    };
    
    console.log('Movie data fetched successfully!');
    return mediaData;
  } catch (error) {
    console.error('Error fetching movie data:', error);
    throw new Error('Failed to fetch movie data. Please try again.');
  }
};

/**
 * Fetch complete TV show data from all sources
 */
export const fetchTVShowData = async (tmdbId: number): Promise<MediaData> => {
  try {
    console.log('Fetching TV show data from TMDb...');
    const tmdbData = await getTVShowDetails(tmdbId);
    
    console.log('Fetching external IDs...');
    const externalIds = await getTVExternalIds(tmdbId);
    const imdbId = externalIds.imdb_id;
    
    // Fetch IMDb rating
    console.log('Fetching IMDb rating...');
    let imdbRating = 0;
    let imdbWeights = [0,0,0,0,0,0,0,0,0,0];
    if (imdbId) {
      imdbRating = await getIMDbRating(imdbId);
      imdbWeights = await getIMDbDistribution(imdbId);
    }
    
    // Fallback to TMDb rating
    if (imdbRating === 0) {
      imdbRating = tmdbData.vote_average;
      console.log('Using TMDb rating as fallback');
    }
    
    // Fetch all episodes
    console.log('Fetching episode data...');
    const episodes = await getAllTVEpisodes(tmdbId, tmdbData.number_of_seasons);
    
    // Transform episodes to our format
    const tvSeriesData = episodes.map((ep: TMDbEpisode) => ({
      seasonNumber: ep.season_number,
      episodeNumber: ep.episode_number,
      title: ep.name,
      rating: ep.vote_average || 0,
    }));
    
    // Construct MediaData object
    const mediaData: MediaData = {
      title: tmdbData.name,
      summary: tmdbData.overview || 'No summary available.',
      releaseDate: tmdbData.first_air_date?.split('-')[0] || 'Unknown',
      runtime: tmdbData.episode_run_time?.[0] || 0,
      type: 'tv',
      posterUrl: getPosterUrl(tmdbData.poster_path),
      scores: {
        imdb: imdbRating,
        letterboxd: 0, // Letterboxd doesn't rate TV shows
      },
      backdropUrl: getPosterUrl(tmdbData.backdrop_path),
      imdbWeights: imdbWeights,
      letterboxdWeights: [],
      tvSeriesData,
    };
    
    console.log('TV show data fetched successfully!');
    return mediaData;
  } catch (error) {
    console.error('Error fetching TV show data:', error);
    throw new Error('Failed to fetch TV show data. Please try again.');
  }
};

/**
 * Search for media and return results
 */
export const searchForMedia = async (
  query: string,
  type: 'movie' | 'tv' = 'movie'
): Promise<Array<{ id: number; title: string; year: string; posterUrl: string }>> => {
  try {
    const results = await searchMedia(query, type);
    
    return results.map((item: any) => ({
      id: item.id,
      title: type === 'movie' ? item.title : item.name,
      year: (type === 'movie' ? item.release_date : item.first_air_date)?.split('-')[0] || 'Unknown',
      posterUrl: getPosterUrl(item.poster_path),
    }));
  } catch (error) {
    console.error('Error searching media:', error);
    return [];
  }
};

/**
 * Fetch media data by type
 */
export const fetchMediaData = async (
  tmdbId: number,
  type: 'movie' | 'tv'
): Promise<MediaData> => {
  if (type === 'movie') {
    return fetchMovieData(tmdbId);
  } else {
    return fetchTVShowData(tmdbId);
  }
};