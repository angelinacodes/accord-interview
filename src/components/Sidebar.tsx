"use client";

import { Box, VStack, Button, Text, HStack } from "@chakra-ui/react";
import { useMovieContext } from "@/contexts/MovieContext";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { state, dispatch } = useMovieContext();
  const tabs = [
    { id: "discover", label: "Discover", icon: "🔍" },
    { id: "watched", label: "Watched", icon: "✅" },
    { id: "watchlist", label: "Watchlist", icon: "📋" },
    { id: "favorites", label: "Favorites", icon: "❤️" },
  ];

  return (
    <Box
      as="aside"
      w="64"
      bg="white"
      _dark={{ bg: "gray.800", borderColor: "gray.700" }}
      shadow="sm"
      borderRight="1px"
      borderColor="gray.200"
      minH="calc(100vh - 80px)"
    >
      <Box as="nav" p={4}>
        <VStack spacing={2} align="stretch">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              variant={activeTab === tab.id ? "solid" : "ghost"}
              colorScheme="yellow"
              justifyContent="flex-start"
              leftIcon={<Text fontSize="lg">{tab.icon}</Text>}
              size="lg"
            >
              {tab.label}
            </Button>
          ))}
        </VStack>

        {/* Quick Stats */}
        <Box
          mt={8}
          p={4}
          bg="yellow.50"
          _dark={{ bg: "yellow.900" }}
          rounded="lg"
        >
          <Text
            fontSize="sm"
            fontWeight="semibold"
            color="yellow.700"
            _dark={{ color: "yellow.300" }}
            mb={3}
          >
            Quick Stats
          </Text>
          <VStack spacing={2} align="stretch">
            <HStack justify="space-between">
              <Text
                fontSize="sm"
                color="yellow.600"
                _dark={{ color: "yellow.400" }}
              >
                Total Movies:
              </Text>
              <Text
                fontSize="sm"
                fontWeight="medium"
                color="yellow.800"
                _dark={{ color: "yellow.200" }}
              >
                0
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text
                fontSize="sm"
                color="yellow.600"
                _dark={{ color: "yellow.400" }}
              >
                Avg Rating:
              </Text>
              <Text
                fontSize="sm"
                fontWeight="medium"
                color="yellow.800"
                _dark={{ color: "yellow.200" }}
              >
                -
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text
                fontSize="sm"
                color="yellow.600"
                _dark={{ color: "yellow.400" }}
              >
                This Year:
              </Text>
              <Text
                fontSize="sm"
                fontWeight="medium"
                color="yellow.800"
                _dark={{ color: "yellow.200" }}
              >
                0
              </Text>
            </HStack>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}
