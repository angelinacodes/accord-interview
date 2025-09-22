"use client";

import { useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Button,
  HStack,
} from "@chakra-ui/react";
import { SearchIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { useMovieContext } from "@/contexts/MovieContext";

export default function Dashboard() {
  const { state, dispatch } = useMovieContext();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Box minH="100vh" bg="white" _dark={{ bg: "gray.900" }}>
      <VStack
        spacing={8}
        align="center"
        justify="flex-start"
        minH="100vh"
        pt={60}
        pb={8}
        px={8}
      >
        {/* App Name */}
        <Heading
          size="3xl"
          color="yellow.500"
          _dark={{ color: "yellow.400" }}
          textAlign="center"
          fontWeight="normal"
          letterSpacing="tight"
        >
          MovieTracker
        </Heading>

        {/* Search Input */}
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

        {/* Search Buttons */}
        <HStack spacing={4}>
          <Button
            bg="yellow.400"
            color="black"
            _hover={{
              bg: "yellow.500",
            }}
            _active={{
              bg: "yellow.600",
            }}
            border="none"
            borderRadius="md"
            px={6}
            py={3}
            fontSize="sm"
            fontWeight="medium"
            rightIcon={<ArrowForwardIcon />}
          >
            Movie Search
          </Button>
          <Button
            bg="yellow.400"
            color="black"
            _hover={{
              bg: "yellow.500",
            }}
            _active={{
              bg: "yellow.600",
            }}
            border="none"
            borderRadius="md"
            px={6}
            py={3}
            fontSize="sm"
            fontWeight="medium"
            rightIcon={<ArrowForwardIcon />}
          >
            I'm Feeling Lucky
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
