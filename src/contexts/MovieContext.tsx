"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";

// State interface
interface MovieState {
  // Empty for now
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
  // Empty for now
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
