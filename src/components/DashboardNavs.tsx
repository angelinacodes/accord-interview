"use client";

import { Button, HStack } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import Link from "next/link";

export default function DashboardNavs() {
  return (
    <HStack spacing={4}>
      <Link href="/browse">
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
      </Link>
      <Link href="/watched">
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
      </Link>
    </HStack>
  );
}
