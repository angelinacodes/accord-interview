"use client";

import { Box, HStack, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/browse", label: "Browse Movies" },
    { href: "/watched", label: "My Watched List" },
  ];

  return (
    <Box bg="white" _dark={{ bg: "gray.800" }} px={6} py={2}>
      <HStack spacing={6} justify="flex-start">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <NextLink key={item.href} href={item.href} passHref>
              <Link
                _hover={{ textDecoration: "none" }}
                _focus={{ boxShadow: "none" }}
              >
                <Text
                  fontSize="xs"
                  fontWeight={isActive ? "medium" : "normal"}
                  color={isActive ? "yellow.600" : "gray.500"}
                  _dark={{
                    color: isActive ? "yellow.400" : "gray.400",
                  }}
                  _hover={{
                    color: "yellow.500",
                    _dark: { color: "yellow.300" },
                  }}
                  transition="color 0.2s"
                >
                  {item.label}
                </Text>
              </Link>
            </NextLink>
          );
        })}
      </HStack>
    </Box>
  );
}
