"use client";

import { Button, HStack } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

export default function DashboardNavs() {
  return (
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
        Browse Movies
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
        My Watched List
      </Button>
    </HStack>
  );
}
