"use client";

import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useMovieContext } from "@/contexts/MovieContext";

export default function SearchComponent() {
  const { state, dispatch } = useMovieContext();
  const [searchQuery, setSearchQuery] = useState("");

  const handleFetchSearchResults = async (query: string) => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      },
    };
    console.log(process.env.NEXT_PUBLIC_TMDB_API_KEY);

    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${query}include_adult=false&language=en-US&page=1`,
      options
    );
    const data = await response.json();
    console.log(data);
  };

  useEffect(() => {
    handleFetchSearchResults("harry potter");
  }, []);

  return (
    <Box w="full" maxW="2xl">
      <InputGroup size="lg">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Search for movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          bg="white"
          _dark={{ bg: "gray.800" }}
          border="1px solid"
          borderColor="gray.300"
          _dark={{ borderColor: "gray.600" }}
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
  );
}
