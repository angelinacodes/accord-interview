"use client";

import { Heading } from "@chakra-ui/react";

export default function HeadingComponent() {
  return (
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
  );
}
