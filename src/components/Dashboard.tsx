"use client";

import { Box, VStack } from "@chakra-ui/react";
import { useMovieContext } from "@/contexts/MovieContext";
import HeadingComponent from "./HeadingComponent";
import SearchComponent from "./SearchComponent";
import DashboardNavs from "./DashboardNavs";

export default function Dashboard() {
  const { state, dispatch } = useMovieContext();

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
        <HeadingComponent />
        <SearchComponent />
        <DashboardNavs />
      </VStack>
    </Box>
  );
}
