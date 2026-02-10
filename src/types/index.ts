export interface MediaData {
  id: number;
  title: string;
  summary: string;
  releaseDate: string;
  runtime: number;
  type: "movie" | "tv";
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
  director?: Cast;
  cast: CastMember[];
}
interface Cast {
  id: number;
  name: string;
}
interface CastMember extends Cast {
  character: string;
  profile_path: string;
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
    id: number;
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

export interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  profile_path: string | null;
  birthday: string | null;
  place_of_birth: string | null;
  known_for_department: string;
}

export interface PersonCredit {
  id: number;
  title?: string; // Movie title
  name?: string; // TV show name
  poster_path: string | null;
  character?: string; // For cast
  job?: string; // For crew
  media_type: "movie" | "tv";
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
}

export interface PersonCombinedCredits {
  cast: PersonCredit[];
  crew: PersonCredit[];
}

export interface PersonProfileData {
  details: PersonDetails;
  cast: PersonCredit[];
  crew: PersonCredit[];
}
