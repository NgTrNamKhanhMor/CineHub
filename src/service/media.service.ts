import { MediaData, TMDbEpisode } from "../types";
import { getLetterboxdData, LetterboxdData } from "./letterboxd.service";
import { getIMDbDistribution, getIMDbRating } from "./omdb.service";
import {
  getAllTVEpisodes,
  getMediaCredits,
  getMovieDetails,
  getMovieExternalIds,
  getPersonCredits,
  getPersonDetails,
  getPosterUrl,
  getTVExternalIds,
  getTVShowDetails,
  searchMedia,
} from "./tmdb.service";

/**
 * Fetch complete movie data from all sources
 */
export const fetchMovieData = async (tmdbId: number): Promise<MediaData> => {
  try {
    const tmdbData = await getMovieDetails(tmdbId);
    const directorData = tmdbData.credits?.crew?.find(
      (person: any) => person.job === "Director",
    );
    const externalIds = await getMovieExternalIds(tmdbId);
    const imdbId = externalIds.imdb_id;
    const castData = await getMediaCredits(tmdbId, "movie");
    // Fetch IMDb rating (from OMDb)
    let imdbRating = 0;
    let imdbWeights = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    if (imdbId) {
      imdbRating = await getIMDbRating(imdbId);
      imdbWeights = await getIMDbDistribution(imdbId);
    }

    // Fallback to TMDb rating if OMDb fails
    if (imdbRating === 0) {
      imdbRating = tmdbData.vote_average;
    }

    // Fetch Letterboxd data
    let letterboxdData: LetterboxdData | null = null;
    if (imdbId) {
      letterboxdData = await getLetterboxdData(
        imdbId,
        tmdbData.title,
        tmdbData.release_date?.split("-")[0],
      );
    }

    // Construct MediaData object
    const mediaData: MediaData = {
      id: tmdbData.id,
      title: tmdbData.title,
      summary: tmdbData.overview || "No summary available.",
      releaseDate: tmdbData.release_date?.split("-")[0] || "Unknown",
      runtime: tmdbData.runtime || 0,
      type: "movie",
      posterUrl: getPosterUrl(tmdbData.poster_path, 500),
      scores: {
        imdb: imdbRating,
        letterboxd: letterboxdData?.rating || 0,
      },
      imdbWeights: imdbWeights,
      letterboxdWeights: letterboxdData?.distribution || [],
      backdropUrl: getPosterUrl(tmdbData.backdrop_path, 1280),
      director: {
        name: directorData?.name || "Unknown Director",
        id: directorData?.id || 0,
      },
      cast: castData,
    };

    return mediaData;
  } catch (error) {
    console.error("Error fetching movie data:", error);
    throw new Error("Failed to fetch movie data. Please try again.");
  }
};

/**
 * Fetch complete TV show data from all sources
 */
export const fetchTVShowData = async (tmdbId: number): Promise<MediaData> => {
  try {
    const tmdbData = await getTVShowDetails(tmdbId);

    const externalIds = await getTVExternalIds(tmdbId);
    const imdbId = externalIds.imdb_id;
    const castData = await getMediaCredits(tmdbId, "tv");
    // Fetch IMDb rating
    let imdbRating = 0;
    let imdbWeights = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    if (imdbId) {
      imdbRating = await getIMDbRating(imdbId);
      imdbWeights = await getIMDbDistribution(imdbId);
    }

    // Fallback to TMDb rating
    if (imdbRating === 0) {
      imdbRating = tmdbData.vote_average;
    }

    // Fetch all episodes
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
      id: tmdbData.id,
      title: tmdbData.name,
      summary: tmdbData.overview || "No summary available.",
      releaseDate: tmdbData.first_air_date?.split("-")[0] || "Unknown",
      runtime: tmdbData.episode_run_time?.[0] || 0,
      type: "tv",
      posterUrl: getPosterUrl(tmdbData.poster_path, 500),
      scores: {
        imdb: imdbRating,
        letterboxd: 0, // Letterboxd doesn't rate TV shows
      },
      backdropUrl: getPosterUrl(tmdbData.backdrop_path, 1280),
      imdbWeights: imdbWeights,
      letterboxdWeights: [],
      tvSeriesData,
      cast: castData,
    };

    return mediaData;
  } catch (error) {
    console.error("Error fetching TV show data:", error);
    throw new Error("Failed to fetch TV show data. Please try again.");
  }
};

/**
 * Search for media and return results
 */
export const searchForMedia = async (
  query: string,
  type: "movie" | "tv" | "person" = "movie",
): Promise<
  Array<{ id: number; title: string; year?: string; posterUrl: string }>
> => {
  try {
    const results = await searchMedia(query, type as any);

    return results.map((item: any) => {
      if (type === "person") {
        return {
          id: item.id,
          title: item.name,
          year: item.known_for_department || "",
          posterUrl: getPosterUrl(item.profile_path, 500),
        };
      }

      return {
        id: item.id,
        title: type === "movie" ? item.title : item.name,
        year:
          (type === "movie" ? item.release_date : item.first_air_date)?.split(
            "-",
          )[0] || "Unknown",
        posterUrl: getPosterUrl(item.poster_path, 500),
      };
    });
  } catch (error) {
    console.error("Error searching media:", error);
    return [];
  }
};

/**
 * Fetch media data by type
 */
export const fetchMediaData = async (
  tmdbId: number,
  type: "movie" | "tv",
): Promise<MediaData> => {
  if (type === "movie") {
    return fetchMovieData(tmdbId);
  } else {
    return fetchTVShowData(tmdbId);
  }
};

export const getPersonProfile = async (personId: number) => {
  const [details, credits] = await Promise.all([
    getPersonDetails(personId),
    getPersonCredits(personId),
  ]);

  return {
    details,
    cast: credits.cast,
    crew: credits.crew,
  };
};

