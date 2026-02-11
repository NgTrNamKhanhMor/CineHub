// src/hooks/useTrendingMovies.ts
import { useState, useEffect } from "react";
import {
  getMovieExternalIds,
  getTrendingMovies,
} from "../service/tmdb.service";
import { TMDbMovie } from "../types";
import { getIMDbRating } from "../service/omdb.service";
import { getLetterboxdTrending } from "../service/letterboxd.service";

export const useTrendingMovies = () => {
  const [movies, setMovies] = useState<TMDbMovie[]>([]);
  const [heroMovie, setHeroMovie] = useState<TMDbMovie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = async () => {
    try {
      setIsLoading(true);
      const data = await getTrendingMovies();
      const letterbopxdMovies = await getLetterboxdTrending()
      console.log("Letterboxd trending movies:", letterbopxdMovies);
      setMovies(data);

      if (data.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * Math.min(data.length, 10),
        );
        const selectedMovie = data[randomIndex];
        let imdbRating = null;
        const externalIds = await getMovieExternalIds(selectedMovie.id);
        const imdbId = externalIds.imdb_id;
        if (imdbId) {
          imdbRating = await getIMDbRating(imdbId);
        }
        if (imdbRating === 0) {
          imdbRating = selectedMovie.vote_average;
        }
        setHeroMovie({ ...selectedMovie, vote_average: imdbRating });
      }
    } catch (err) {
      setError("Failed to fetch trending movies");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // We return a 'refetch' function in case you want a "Pull to Refresh" feature later
  return { movies, heroMovie, isLoading, error, refetch: fetchMovies };
};
