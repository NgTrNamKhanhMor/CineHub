export interface MediaData {
  title: string;
  summary: string;
  releaseDate: string;
  runtime: number;
  type: 'movie' | 'tv';
  posterUrl: string;
  scores: {
    imdb: number;
    letterboxd: number;
  };
   imdbWeights: number[];
  letterboxdWeights: number[];
  tvSeriesData?: Array<{
    seasonNumber: number;
    episodeNumber: number;
    title: string;
    rating: number;
  }>;
  backdropUrl: string; 
  director?: string;
}

export interface TMDbMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  runtime: number;
  poster_path: string;
  vote_average: number;
  imdb_id?: string;
  backdrop_path: string;
  credits?: Credits;
}
interface Credits {
  crew: Array<{
    job: string;
    name: string;
  }>;
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
   backdrop_path: string;
}

export interface TMDbEpisode {
  season_number: number;
  episode_number: number;
  name: string;
  vote_average: number;
  air_date: string;
}