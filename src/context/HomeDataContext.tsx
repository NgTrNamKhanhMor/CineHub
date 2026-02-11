// src/context/DataContext.tsx
import React, { createContext, useContext, useState, useCallback } from "react";
import { getMovieExternalIds, getTrendingMovies } from "../service/tmdb.service";
import { getIMDbRating } from "../service/omdb.service";
import { TMDbMovie } from "../types";

interface DataContextType {
  movies: TMDbMovie[];
  heroMovie: TMDbMovie | null;
  isLoading: boolean;
  error: string | null;
  loadData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const HomeDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [movies, setMovies] = useState<TMDbMovie[]>([]);
  const [heroMovie, setHeroMovie] = useState<TMDbMovie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await getTrendingMovies();
      setMovies(data);

      if (data.length > 0) {
        // Pick random movie for Hero
        const randomIndex = Math.floor(Math.random() * Math.min(data.length, 10));
        const selectedMovie = data[randomIndex];
        
        // Fetch IMDb details
        const externalIds = await getMovieExternalIds(selectedMovie.id);
        const imdbId = externalIds.imdb_id;
        
        let imdbRating = 0;
        if (imdbId) {
          imdbRating = await getIMDbRating(imdbId);
        }

        // Fallback to TMDb rating if IMDb returns 0
        const finalRating = imdbRating > 0 ? imdbRating : selectedMovie.vote_average;
        
        setHeroMovie({ ...selectedMovie, vote_average: finalRating });
      }
    } catch (err) {
      setError("Failed to fetch movie data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <DataContext.Provider value={{ movies, heroMovie, isLoading, error, loadData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useHomeData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useHomeData must be used within HomeDataProvider");
  return context;
};