"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  Text,
  HStack,
  Button,
  Image,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useMovieContext, Movie } from "@/contexts/MovieContext";

export default function SearchComponent() {
  const { state, dispatch } = useMovieContext();
  const [localQuery, setLocalQuery] = useState("");
  const [currentResults, setCurrentResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [savingMovies, setSavingMovies] = useState<Set<number>>(new Set());
  const [savedMovies, setSavedMovies] = useState<Set<number>>(new Set());

  const handleFetchSearchResults = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setCurrentResults([]);
        setHasSearched(false);
        return;
      }

      setHasSearched(true);

      // Check if we already have results for this query
      if (state.searchResult[query]) {
        setCurrentResults(state.searchResult[query]);
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/search?query=${encodeURIComponent(query)}&page=1`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Search results:", data);

        const results = data.results || [];
        setCurrentResults(results);

        // Cache the results in context
        dispatch({
          type: "SET_SEARCH_RESULTS",
          payload: { query, results },
        });
      } catch (error) {
        console.error("Error fetching search results:", error);
        setCurrentResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [state.searchResult, dispatch]
  );

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleFetchSearchResults(localQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localQuery, handleFetchSearchResults]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  };

  const isMovieWatched = (tmdbId: number) => {
    return state.watchedMovies.some((movie) => movie.tmdb_id === tmdbId);
  };

  const getButtonState = (movie: Movie) => {
    const isWatched = isMovieWatched(movie.id);
    const isSaving = savingMovies.has(movie.id);
    const isSaved = savedMovies.has(movie.id);

    if (isSaved) {
      return {
        text: "Added!",
        variant: "solid",
        colorScheme: "green",
        isDisabled: true,
      };
    }
    if (isSaving) {
      return {
        text: "Adding...",
        variant: "outline",
        colorScheme: "yellow",
        isDisabled: true,
      };
    }
    if (isWatched) {
      return {
        text: "Watched",
        variant: "solid",
        colorScheme: "yellow",
        isDisabled: true,
      };
    }
    return {
      text: "Save to Watched",
      variant: "outline",
      colorScheme: "yellow",
      isDisabled: false,
    };
  };

  const handleSaveToWatched = async (movie: Movie) => {
    // Add to saving state
    setSavingMovies((prev) => new Set(prev).add(movie.id));
    
    try {
      const response = await fetch("/api/watched", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movie),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Movie saved to watched list:", movie.title);
        // Add to context immediately for better UX - use the returned movie data with database ID
        dispatch({ type: "ADD_WATCHED_MOVIE", payload: responseData.movie });
        // Show success state
        setSavedMovies((prev) => new Set(prev).add(movie.id));
        // Clear success state after 2 seconds
        setTimeout(() => {
          setSavedMovies((prev) => {
            const newSet = new Set(prev);
            newSet.delete(movie.id);
            return newSet;
          });
        }, 2000);
      } else {
        console.error("Failed to save movie to watched list");
        // TODO: Show error notification
      }
    } catch (error) {
      console.error("Error saving movie:", error);
      // TODO: Show error notification
    } finally {
      // Remove from saving state
      setSavingMovies((prev) => {
        const newSet = new Set(prev);
        newSet.delete(movie.id);
        return newSet;
      });
    }
  };

  return (
    <VStack spacing={4} w="full" maxW="2xl">
      <Box w="full">
        <InputGroup size="lg">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search for movies..."
            value={localQuery}
            onChange={handleInputChange}
            bg="white"
            _dark={{ bg: "gray.800", borderColor: "gray.600" }}
            border="1px solid"
            borderColor="gray.300"
            borderRadius="full"
            _focus={{
              borderColor: "blue.500",
              boxShadow: "0 2px 5px 1px rgba(64,60,67,.16)",
              _dark: {
                borderColor: "blue.400",
                boxShadow: "0 2px 5px 1px rgba(0,0,0,.2)",
              },
            }}
            _hover={{
              boxShadow: "0 2px 5px 1px rgba(64,60,67,.16)",
              _dark: {
                boxShadow: "0 2px 5px 1px rgba(0,0,0,.2)",
              },
            }}
            fontSize="16px"
            py={6}
          />
        </InputGroup>
      </Box>

      {/* Search Results */}
      {isLoading && (
        <Text color="gray.500" fontSize="sm">
          Searching...
        </Text>
      )}

      {currentResults.length > 0 && !isLoading && (
        <VStack
          spacing={2}
          w="full"
          align="stretch"
          maxH="400px"
          overflowY="auto"
        >
          {currentResults.slice(0, 10).map((movie) => (
            <Box
              key={movie.id}
              p={3}
              bg="white"
              _dark={{ bg: "gray.800", borderColor: "gray.600" }}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              cursor="pointer"
              _hover={{
                bg: "gray.50",
                _dark: { bg: "gray.700" },
              }}
            >
              <HStack spacing={3} align="start">
                {/* Movie Poster */}
                <Image
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                      : "https://via.placeholder.com/92x138/cccccc/666666?text=No+Image"
                  }
                  alt={`${movie.title} poster`}
                  w="46px"
                  h="69px"
                  objectFit="cover"
                  borderRadius="sm"
                  fallbackSrc="https://via.placeholder.com/92x138/cccccc/666666?text=No+Image"
                />

                {/* Movie Info */}
                <VStack spacing={1} align="start" flex="1">
                  <Text fontWeight="medium" fontSize="sm">
                    {movie.title}
                  </Text>
                  <Text fontSize="xs" color="gray.500" noOfLines={2}>
                    {movie.overview}
                  </Text>
                  <Text fontSize="xs" color="yellow.600">
                    {movie.release_date
                      ? new Date(movie.release_date).getFullYear()
                      : "N/A"}{" "}
                    • ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
                  </Text>
                </VStack>

                {/* Save to Watched Button */}
                {(() => {
                  const buttonState = getButtonState(movie);
                  return (
                    <Button
                      size="xs"
                      colorScheme={buttonState.colorScheme}
                      variant={buttonState.variant}
                      isDisabled={buttonState.isDisabled}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!buttonState.isDisabled) {
                          handleSaveToWatched(movie);
                        }
                      }}
                    >
                      {buttonState.text}
                    </Button>
                  );
                })()}
              </HStack>
            </Box>
          ))}
        </VStack>
      )}

      {hasSearched &&
        localQuery &&
        currentResults.length === 0 &&
        !isLoading && (
          <Text color="gray.500" fontSize="sm">
            No movies found for &quot;{localQuery}&quot;
          </Text>
        )}
    </VStack>
  );
}
