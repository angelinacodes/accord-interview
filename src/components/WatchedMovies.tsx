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
  Grid,
  GridItem,
  Heading,
  Container,
  Spinner,
  Center,
  Tooltip,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import { useMovieContext, Movie } from "@/contexts/MovieContext";
import Link from "next/link";

export default function WatchedMovies() {
  const { state, dispatch } = useMovieContext();
  const [localQuery, setLocalQuery] = useState("");
  const [currentResults, setCurrentResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  // Remove local state - now using context
  // const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);
  // const [isLoadingWatched, setIsLoadingWatched] = useState(true);
  const [showSearchResults, setShowSearchResults] = useState(true);
  const [savingMovies, setSavingMovies] = useState<Set<number>>(new Set());
  const [savedMovies, setSavedMovies] = useState<Set<number>>(new Set());
  const [removingMovies, setRemovingMovies] = useState<Set<number>>(new Set());
  const [removedMovies, setRemovedMovies] = useState<Set<number>>(new Set());

  // Watched movies are now fetched globally in AppInitializer

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
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [localQuery, handleFetchSearchResults]);

  // ESC key handler to hide search results
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowSearchResults(false);
        setLocalQuery("");
        setCurrentResults([]);
        setHasSearched(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
    setShowSearchResults(true); // Show results when user starts typing
  };

  const handleHideSearchResults = () => {
    setShowSearchResults(false);
    setLocalQuery("");
    setCurrentResults([]);
    setHasSearched(false);
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
      text: "Add to Watched",
      variant: "outline",
      colorScheme: "yellow",
      isDisabled: false,
    };
  };

  const getRemoveButtonState = (movie: Movie) => {
    const isRemoving = removingMovies.has(movie.id);
    const isRemoved = removedMovies.has(movie.id);

    if (isRemoved) {
      return {
        text: "Removed!",
        variant: "solid",
        colorScheme: "green",
        isDisabled: true,
      };
    }
    if (isRemoving) {
      return {
        text: "Removing...",
        variant: "outline",
        colorScheme: "red",
        isDisabled: true,
      };
    }
    return {
      text: "Remove",
      variant: "outline",
      colorScheme: "red",
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

  const handleRemoveFromWatched = async (movieId: number) => {
    // Add to removing state
    setRemovingMovies((prev) => new Set(prev).add(movieId));

    try {
      const response = await fetch(`/api/watched?id=${movieId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Movie removed from watched list");
        // Show success state
        setRemovedMovies((prev) => new Set(prev).add(movieId));
        // Remove from context after showing success
        setTimeout(() => {
          dispatch({ type: "REMOVE_WATCHED_MOVIE", payload: movieId });
          // Clear success state
          setRemovedMovies((prev) => {
            const newSet = new Set(prev);
            newSet.delete(movieId);
            return newSet;
          });
        }, 1500);
      } else {
        console.error("Failed to remove movie from watched list");
        // TODO: Show error notification
      }
    } catch (error) {
      console.error("Error removing movie:", error);
      // TODO: Show error notification
    } finally {
      // Remove from removing state
      setRemovingMovies((prev) => {
        const newSet = new Set(prev);
        newSet.delete(movieId);
        return newSet;
      });
    }
  };

  return (
    <Box minH="100vh" bg="white" _dark={{ bg: "gray.900" }}>
      <Container maxW="container.xl" py={8}>
        {/* Header */}
        <VStack spacing={6} align="stretch" position="relative">
          <VStack spacing={2} align="start">
            <Link href="/">
              <Heading
                size="lg"
                color="yellow.500"
                _dark={{ color: "yellow.400" }}
                cursor="pointer"
                _hover={{
                  color: "yellow.600",
                  _dark: { color: "yellow.300" },
                  transform: "scale(1.05)",
                  transition: "all 0.2s",
                }}
              >
                MovieTracker
              </Heading>
            </Link>
          </VStack>

          {/* Compact Search */}
          <Box maxW="md">
            <InputGroup size="md">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search for movies to add..."
                value={localQuery}
                onChange={handleInputChange}
                bg="white"
                _dark={{ bg: "gray.800", borderColor: "gray.600" }}
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                _focus={{
                  borderColor: "yellow.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-yellow-500)",
                }}
              />
            </InputGroup>
            {!showSearchResults && localQuery && (
              <Button
                size="xs"
                variant="outline"
                colorScheme="yellow"
                mt={2}
                onClick={() => setShowSearchResults(true)}
              >
                Show Search Results
              </Button>
            )}
          </Box>

          {/* Search Results Overlay */}
          {showSearchResults &&
            (isLoading ||
              currentResults.length > 0 ||
              (hasSearched && localQuery && currentResults.length === 0)) && (
              <Box
                position="absolute"
                top="120px"
                left="0"
                right="0"
                zIndex={10}
                bg="white"
                _dark={{ bg: "gray.900", borderColor: "gray.600" }}
                borderRadius="lg"
                shadow="lg"
                border="1px solid"
                borderColor="gray.200"
                maxH="400px"
                overflowY="auto"
              >
                {isLoading && (
                  <Center py={4}>
                    <Spinner color="yellow.500" />
                  </Center>
                )}

                {currentResults.length > 0 && !isLoading && (
                  <VStack spacing={2} align="stretch" p={4}>
                    <HStack justify="space-between" align="center">
                      <Text fontSize="sm" color="gray.600" fontWeight="medium">
                        Search Results:
                      </Text>
                      <Button
                        size="xs"
                        variant="ghost"
                        colorScheme="gray"
                        leftIcon={<CloseIcon />}
                        onClick={handleHideSearchResults}
                      >
                        Hide
                      </Button>
                    </HStack>
                    {currentResults.slice(0, 5).map((movie) => (
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
                    <VStack spacing={2} p={4}>
                      <Text color="gray.500" fontSize="sm">
                        No movies found for &quot;{localQuery}&quot;
                      </Text>
                      <Button
                        size="xs"
                        variant="ghost"
                        colorScheme="gray"
                        leftIcon={<CloseIcon />}
                        onClick={handleHideSearchResults}
                      >
                        Hide
                      </Button>
                    </VStack>
                  )}
              </Box>
            )}

          {/* Watched Movies Grid */}
          <Box>
            <Text
              fontSize="lg"
              fontWeight="semibold"
              mb={4}
              color="gray.700"
              _dark={{ color: "gray.300" }}
            >
              Your Watched Movies ({state.watchedMovies.length})
            </Text>

            {state.isLoadingWatched ? (
              <Center py={8}>
                <Spinner color="yellow.500" />
              </Center>
            ) : state.watchedMovies.length === 0 ? (
              <Center py={8}>
                <VStack spacing={4}>
                  <Text color="gray.500" fontSize="lg">
                    No movies in your watched list yet
                  </Text>
                  <Text color="gray.400" fontSize="sm" textAlign="center">
                    Search for movies above and add them to your watched list
                  </Text>
                </VStack>
              </Center>
            ) : (
              <Grid
                templateColumns="repeat(auto-fill, minmax(220px, 1fr))"
                gap={4}
              >
                {state.watchedMovies.map((movie) => (
                  <GridItem key={movie.id}>
                    <Box
                      bg="white"
                      _dark={{ bg: "gray.800" }}
                      borderRadius="lg"
                      overflow="hidden"
                      shadow="md"
                      h="280px"
                      display="flex"
                      flexDirection="column"
                      _hover={{
                        shadow: "lg",
                        transform: "translateY(-2px)",
                        transition: "all 0.2s",
                      }}
                    >
                      <Image
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                            : "https://via.placeholder.com/300x200/cccccc/666666?text=No+Image"
                        }
                        alt={`${movie.title} poster`}
                        w="100%"
                        h="180px"
                        objectFit="cover"
                        fallbackSrc="https://via.placeholder.com/300x200/cccccc/666666?text=No+Image"
                      />
                      <Box
                        p={3}
                        flex="1"
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                      >
                        <Box>
                          <Tooltip
                            label={movie.title}
                            hasArrow
                            placement="top"
                            bg="gray.700"
                            color="white"
                            fontSize="sm"
                          >
                            <Text
                              fontWeight="semibold"
                              fontSize="xs"
                              noOfLines={1}
                              mb={1}
                              cursor="help"
                            >
                              {movie.title}
                            </Text>
                          </Tooltip>
                          <Text fontSize="xs" color="gray.500" mb={2}>
                            {movie.release_date
                              ? new Date(movie.release_date).getFullYear()
                              : "N/A"}{" "}
                            • ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
                          </Text>
                        </Box>
                        {(() => {
                          const buttonState = getRemoveButtonState(movie);
                          return (
                            <Button
                              size="xs"
                              colorScheme={buttonState.colorScheme}
                              variant={buttonState.variant}
                              w="full"
                              fontSize="xs"
                              isDisabled={buttonState.isDisabled}
                              onClick={() => {
                                if (!buttonState.isDisabled) {
                                  handleRemoveFromWatched(movie.id);
                                }
                              }}
                            >
                              {buttonState.text}
                            </Button>
                          );
                        })()}
                      </Box>
                    </Box>
                  </GridItem>
                ))}
              </Grid>
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
