"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";

// Movie type definition
export interface Movie {
  id: number;
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
  searchResult: Record<string, Movie[]>;
}

// Action types
type MovieAction = {
  type: string;
  payload?: any;
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
    default:
      return state;
  }
};

// Initial state
const initialState: MovieState = {
  searchResult: {},
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
