"use client";

import { useEffect } from "react";
import { useMovieContext } from "@/contexts/MovieContext";

export default function AppInitializer() {
  const { state, dispatch } = useMovieContext();

  useEffect(() => {
    const fetchWatchedMovies = async () => {
      // Only fetch if we don't have watched movies in context and not already loading
      if (state.watchedMovies.length === 0 && !state.isLoadingWatched) {
        dispatch({ type: "SET_LOADING_WATCHED", payload: true });
        
        try {
          const response = await fetch("/api/watched");
          if (response.ok) {
            const data = await response.json();
            dispatch({
              type: "SET_WATCHED_MOVIES",
              payload: data.movies || [],
            });
          } else {
            console.error("Failed to fetch watched movies on app load");
            dispatch({ type: "SET_LOADING_WATCHED", payload: false });
          }
        } catch (error) {
          console.error("Error fetching watched movies on app load:", error);
          dispatch({ type: "SET_LOADING_WATCHED", payload: false });
        }
      }
    };

    fetchWatchedMovies();
  }, [state.watchedMovies.length, state.isLoadingWatched, dispatch]);

  // This component doesn't render anything
  return null;
}
