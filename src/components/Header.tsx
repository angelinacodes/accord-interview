"use client";

import {
  Box,
  Flex,
  Heading,
  Text,
  HStack,
  Badge,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useMovieContext } from "@/contexts/MovieContext";

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { state, dispatch } = useMovieContext();

  return (
    <Box
      as="header"
      bg="white"
      _dark={{ bg: "gray.800" }}
      shadow="sm"
      borderBottom="1px"
      borderColor="gray.200"
      _dark={{ borderColor: "gray.700" }}
    >
      <Box maxW="7xl" mx="auto" px={6} py={4}>
        <Flex align="center" justify="space-between">
          <HStack spacing={4}>
            <Heading size="lg" color="gray.900" _dark={{ color: "white" }}>
              MovieTracker
            </Heading>
            <Text fontSize="sm" color="gray.500" _dark={{ color: "gray.400" }}>
              Your Personal Movie Collection
            </Text>
          </HStack>

          <HStack spacing={4}>
            {/* Stats */}
            <HStack spacing={6} display={{ base: "none", md: "flex" }}>
              <HStack spacing={1}>
                <Text
                  fontSize="sm"
                  color="gray.600"
                  _dark={{ color: "gray.300" }}
                >
                  Watched:
                </Text>
                <Badge colorScheme="yellow" variant="subtle">
                  0
                </Badge>
              </HStack>
              <HStack spacing={1}>
                <Text
                  fontSize="sm"
                  color="gray.600"
                  _dark={{ color: "gray.300" }}
                >
                  Watchlist:
                </Text>
                <Badge colorScheme="yellow" variant="subtle">
                  0
                </Badge>
              </HStack>
              <HStack spacing={1}>
                <Text
                  fontSize="sm"
                  color="gray.600"
                  _dark={{ color: "gray.300" }}
                >
                  Favorites:
                </Text>
                <Badge colorScheme="yellow" variant="subtle">
                  0
                </Badge>
              </HStack>
            </HStack>

            {/* Theme Toggle */}
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              colorScheme="yellow"
            />
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
}
