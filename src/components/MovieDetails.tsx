"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  HStack,
  VStack,
  AspectRatio,
} from "@chakra-ui/react";
import { ArrowBackIcon, StarIcon } from "@chakra-ui/icons";
import { useMovieContext, Movie } from "@/contexts/MovieContext";

interface MovieDetailsProps {
  movie: Movie;
  onBack: () => void;
}

export default function MovieDetails({ movie, onBack }: MovieDetailsProps) {
  const { state, dispatch } = useMovieContext();
  return (
    <Box
      bg="white"
      _dark={{ bg: "gray.800" }}
      rounded="lg"
      shadow="lg"
      overflow="hidden"
    >
      {/* Back Button */}
      <Box
        p={6}
        borderBottom="1px"
        borderColor="gray.200"
        _dark={{ borderColor: "gray.700" }}
      >
        <Button
          leftIcon={<ArrowBackIcon />}
          variant="ghost"
          onClick={onBack}
          color="gray.600"
          _dark={{ color: "gray.400" }}
          _hover={{ color: "gray.900", _dark: { color: "white" } }}
        >
          Back to movies
        </Button>
      </Box>

      <Box p={6}>
        <Flex direction={{ base: "column", lg: "row" }} gap={8}>
          {/* Movie Poster */}
          <Box flexShrink={0}>
            <AspectRatio ratio={2 / 3} w="64">
              <Box
                bg="yellow.100"
                _dark={{ bg: "yellow.900" }}
                rounded="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <VStack spacing={4}>
                  <Text
                    fontSize="6xl"
                    color="yellow.500"
                    _dark={{ color: "yellow.400" }}
                  >
                    🎬
                  </Text>
                </VStack>
              </Box>
            </AspectRatio>
          </Box>

          {/* Movie Info */}
          <Box flex="1">
            <Heading
              size="xl"
              mb={2}
              color="gray.900"
              _dark={{ color: "white" }}
            >
              {movie.title}
            </Heading>

            <HStack spacing={4} mb={4}>
              <HStack spacing={1}>
                <StarIcon color="yellow.500" />
                <Text
                  fontWeight="semibold"
                  color="gray.900"
                  _dark={{ color: "white" }}
                >
                  {movie.vote_average.toFixed(1)}
                </Text>
                <Text color="gray.500" _dark={{ color: "gray.400" }}>
                  /10
                </Text>
              </HStack>
              <Text color="gray.500" _dark={{ color: "gray.400" }}>
                •
              </Text>
              <Text color="gray.600" _dark={{ color: "gray.300" }}>
                {new Date(movie.release_date).getFullYear()}
              </Text>
            </HStack>

            <Text
              color="gray.700"
              _dark={{ color: "gray.300" }}
              mb={6}
              lineHeight="relaxed"
            >
              {movie.overview}
            </Text>

            {/* Action Buttons */}
            <HStack spacing={3} wrap="wrap">
              <Button colorScheme="yellow" leftIcon={<StarIcon />}>
                Add to Favorites
              </Button>
              <Button colorScheme="yellow" leftIcon={<StarIcon />}>
                Add to Watchlist
              </Button>
              <Button colorScheme="yellow" leftIcon={<StarIcon />}>
                Rate Movie
              </Button>
            </HStack>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
