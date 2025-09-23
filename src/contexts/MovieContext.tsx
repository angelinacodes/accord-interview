"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";

// Movie type definition
export interface Movie {
  id: number; // Database primary key
  tmdb_id?: number; // TMDb ID (for movies from database)
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  poster_path?: string;
  backdrop_path?: string;
  genre_ids?: number[];
  adult?: boolean;
  original_language?: string;
  original_title?: string;
  popularity?: number;
  video?: boolean;
  vote_count?: number;
}

// State interface
interface MovieState {
  searchResult: Record<string, Movie[]>; // Cache search results
  watchedMovies: Movie[]; // Store watched movies list
  isLoadingWatched: boolean; // Loading state for watched movies
}

// Action types
type MovieAction = {
  type: string;
  payload?: unknown;
};

// Context type
interface MovieContextType {
  state: MovieState;
  dispatch: React.Dispatch<MovieAction>;
}

// Create context
const MovieContext = createContext<MovieContextType | undefined>(undefined);

// Reducer function
const movieReducer = (state: MovieState, action: MovieAction): MovieState => {
  switch (action.type) {
    case "SET_SEARCH_RESULTS":
      const { query, results } = action.payload as {
        query: string;
        results: Movie[];
      };
      return {
        ...state,
        searchResult: {
          ...state.searchResult,
          [query]: results,
        },
      };
    case "SET_WATCHED_MOVIES":
      const movies = action.payload as Movie[];
      return {
        ...state,
        watchedMovies: movies,
        isLoadingWatched: false,
      };
    case "ADD_WATCHED_MOVIE":
      const newMovie = action.payload as Movie;
      return {
        ...state,
        watchedMovies: [newMovie, ...state.watchedMovies],
      };
    case "REMOVE_WATCHED_MOVIE":
      const movieId = action.payload as number;
      return {
        ...state,
        watchedMovies: state.watchedMovies.filter(
          (movie) => movie.id !== movieId
        ),
      };
    case "SET_LOADING_WATCHED":
      const isLoading = action.payload as boolean;
      return {
        ...state,
        isLoadingWatched: isLoading,
      };
    default:
      return state;
  }
};

// Initial state
const initialState: MovieState = {
  searchResult: {},
  watchedMovies: [],
  isLoadingWatched: false,
};

// Custom hook to use the context
export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error("useMovieContext must be used within a MovieProvider");
  }
  return context;
};

// Provider component props
interface MovieProviderProps {
  children: ReactNode;
}

// Provider component
export const MovieProvider = ({ children }: MovieProviderProps) => {
  const [state, dispatch] = useReducer(movieReducer, initialState);

  const value: MovieContextType = {
    state,
    dispatch,
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};
