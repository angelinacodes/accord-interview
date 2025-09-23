"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  VStack,
  Text,
  Button,
  Image,
  Grid,
  GridItem,
  Heading,
  Container,
  Spinner,
  Center,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Tooltip,
} from "@chakra-ui/react";
import { useMovieContext, Movie } from "@/contexts/MovieContext";
import Link from "next/link";

// Movie categories
const MOVIE_CATEGORIES = [
  { id: "now-playing", name: "Now Playing", endpoint: "now-playing" },
  { id: "popular", name: "Popular", endpoint: "popular" },
  { id: "top-rated", name: "Top Rated", endpoint: "top-rated" },
  { id: "upcoming", name: "Upcoming", endpoint: "upcoming" },
];

export default function BrowseMovies() {
  const { state, dispatch } = useMovieContext();
  const [selectedCategory, setSelectedCategory] = useState("now-playing");
  // Remove local state - now using context
  // const [categoryMovies, setCategoryMovies] = useState<Record<string, Movie[]>>({});
  // const [loadingCategories, setLoadingCategories] = useState<Set<string>>(new Set());
  const [savingMovies, setSavingMovies] = useState<Set<number>>(new Set());
  const [savedMovies, setSavedMovies] = useState<Set<number>>(new Set());

  // Fetch movies for a specific category
  const fetchCategoryMovies = useCallback(
    async (categoryId: string) => {
      if (
        state.browseLists[categoryId] ||
        state.loadingBrowseLists.has(categoryId)
      ) {
        return; // Already loaded or loading
      }

      dispatch({
        type: "SET_LOADING_BROWSE_LIST",
        payload: { category: categoryId, isLoading: true },
      });

      try {
        const category = MOVIE_CATEGORIES.find((cat) => cat.id === categoryId);
        if (!category) return;

        const response = await fetch(`/api/movies/${category.endpoint}?page=1`);
        if (response.ok) {
          const data = await response.json();
          dispatch({
            type: "SET_BROWSE_LIST",
            payload: { category: categoryId, movies: data.results || [] },
          });
        } else {
          console.error(`Failed to fetch ${categoryId} movies`);
        }
      } catch (error) {
        console.error(`Error fetching ${categoryId} movies:`, error);
      } finally {
        dispatch({
          type: "SET_LOADING_BROWSE_LIST",
          payload: { category: categoryId, isLoading: false },
        });
      }
    },
    [state.browseLists, state.loadingBrowseLists, dispatch]
  );

  // Load movies for selected category
  useEffect(() => {
    fetchCategoryMovies(selectedCategory);
  }, [selectedCategory, fetchCategoryMovies]);

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
        // Add to context immediately for better UX
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
      }
    } catch (error) {
      console.error("Error saving movie:", error);
    } finally {
      // Remove from saving state
      setSavingMovies((prev) => {
        const newSet = new Set(prev);
        newSet.delete(movie.id);
        return newSet;
      });
    }
  };

  const renderMovieGrid = (movies: Movie[]) => {
    if (state.loadingBrowseLists.has(selectedCategory)) {
      return (
        <Center py={8}>
          <Spinner color="yellow.500" size="lg" />
        </Center>
      );
    }

    if (movies.length === 0) {
      return (
        <Center py={8}>
          <Text color="gray.500" fontSize="lg">
            No movies found in this category
          </Text>
        </Center>
      );
    }

    return (
      <Grid templateColumns="repeat(auto-fill, minmax(220px, 1fr))" gap={4}>
        {movies.map((movie) => (
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
                  const buttonState = getButtonState(movie);
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
                          handleSaveToWatched(movie);
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
    );
  };

  return (
    <Box minH="100vh" bg="white" _dark={{ bg: "gray.900" }}>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
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
            <Heading
              size="md"
              color="gray.600"
              _dark={{ color: "gray.300" }}
              fontWeight="normal"
            >
              Browse Movies
            </Heading>
          </VStack>

          {/* Category Tabs */}
          <Tabs
            index={MOVIE_CATEGORIES.findIndex(
              (cat) => cat.id === selectedCategory
            )}
            onChange={(index) =>
              setSelectedCategory(MOVIE_CATEGORIES[index].id)
            }
            colorScheme="yellow"
          >
            <TabList>
              {MOVIE_CATEGORIES.map((category) => (
                <Tab key={category.id} fontSize="sm">
                  {category.name}
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              {MOVIE_CATEGORIES.map((category) => (
                <TabPanel key={category.id} px={0}>
                  {renderMovieGrid(state.browseLists[category.id] || [])}
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
}
