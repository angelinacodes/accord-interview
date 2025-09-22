"use client";

import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { useMovieContext, Movie } from "@/contexts/MovieContext";

interface MovieGridProps {
  searchQuery: string;
  activeTab: string;
  onMovieSelect: (movie: Movie) => void;
}

export default function MovieGrid({
  searchQuery,
  activeTab,
  onMovieSelect,
}: MovieGridProps) {
  const { state, dispatch } = useMovieContext();
  // Get movies based on current view
  const getCurrentMovies = (): Movie[] => {
    // For now, just return placeholder movies
    return getPlaceholderMovies();
  };

  // Placeholder data - will be replaced with TMDb API data
  const getPlaceholderMovies = (): Movie[] => [
    {
      id: 1,
      title: "The Shawshank Redemption",
      release_date: "1994-09-23",
      vote_average: 8.7,
      overview:
        "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison.",
    },
    {
      id: 2,
      title: "The Godfather",
      release_date: "1972-03-14",
      vote_average: 8.7,
      overview:
        "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    },
    {
      id: 3,
      title: "The Dark Knight",
      release_date: "2008-07-16",
      vote_average: 8.5,
      overview:
        "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    },
  ];

  const currentMovies = getCurrentMovies();

  const getGridTitle = () => {
    if (searchQuery) return `Search results for "${searchQuery}"`;
    switch (activeTab) {
      case "discover":
        return "Discover Movies";
      case "watched":
        return "Watched Movies";
      case "watchlist":
        return "Watchlist";
      case "favorites":
        return "Favorite Movies";
      default:
        return "Movies";
    }
  };

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg" color="gray.900" _dark={{ color: "white" }}>
          {getGridTitle()}
        </Heading>
        <Text fontSize="sm" color="gray.500" _dark={{ color: "gray.400" }}>
          {currentMovies.length} movies
        </Text>
      </HStack>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={6}>
        {currentMovies.map((movie) => (
          <Card
            key={movie.id}
            bg="white"
            _dark={{ bg: "gray.800" }}
            shadow="md"
            _hover={{ shadow: "lg" }}
            cursor="pointer"
            transition="all 0.2s"
            onClick={() => onMovieSelect(movie)}
          >
            <CardBody p={0}>
              <Box
                h="300px"
                bg="yellow.100"
                _dark={{ bg: "yellow.900" }}
                position="relative"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <VStack spacing={4}>
                  <Text
                    fontSize="4xl"
                    color="yellow.500"
                    _dark={{ color: "yellow.400" }}
                  >
                    🎬
                  </Text>
                </VStack>
                <Badge
                  position="absolute"
                  top={2}
                  right={2}
                  bg="yellow.500"
                  color="white"
                  fontSize="xs"
                  px={2}
                  py={1}
                  rounded="md"
                >
                  <HStack spacing={1}>
                    <StarIcon boxSize={2} />
                    <Text>{movie.vote_average.toFixed(1)}</Text>
                  </HStack>
                </Badge>
              </Box>
              <Box p={4}>
                <Heading size="sm" mb={1} noOfLines={2}>
                  {movie.title}
                </Heading>
                <Text
                  fontSize="xs"
                  color="gray.500"
                  _dark={{ color: "gray.400" }}
                  mb={2}
                >
                  {new Date(movie.release_date).getFullYear()}
                </Text>
                <Text
                  fontSize="xs"
                  color="gray.600"
                  _dark={{ color: "gray.300" }}
                  noOfLines={3}
                >
                  {movie.overview}
                </Text>
              </Box>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
}
