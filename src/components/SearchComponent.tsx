"use client";

import { useState, useEffect } from "react";
import { Box, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useMovieContext } from "@/contexts/MovieContext";

export default function SearchComponent() {
  const { state, dispatch } = useMovieContext();
  const [searchQuery, setSearchQuery] = useState("");

  const handleFetchSearchResults = async (query: string) => {
    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(query)}&page=1`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Search results:", data);

      // TODO: Update context with search results
      // dispatch({ type: 'SET_SEARCH_RESULTS', payload: data.results });
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  useEffect(() => {
    handleFetchSearchResults("lord of the rings");
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
  );
}
