"use client";

import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export default function SearchBar({ query, onQueryChange }: SearchBarProps) {
  return (
    <InputGroup size="lg" mb={8}>
      <InputLeftElement pointerEvents="none">
        <SearchIcon color="yellow.400" />
      </InputLeftElement>
      <Input
        placeholder="Search for movies..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        bg="white"
        _dark={{ bg: "gray.700" }}
        borderColor="yellow.200"
        _dark={{ borderColor: "yellow.700" }}
        _focus={{
          borderColor: "yellow.500",
          boxShadow: "0 0 0 1px #f59e0b",
        }}
      />
      {query && (
        <InputRightElement>
          <IconButton
            aria-label="Clear search"
            icon={<CloseIcon />}
            size="sm"
            variant="ghost"
            onClick={() => onQueryChange("")}
          />
        </InputRightElement>
      )}
    </InputGroup>
  );
}
