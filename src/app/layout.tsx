import type { Metadata } from "next";
import "./globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/theme";
import { MovieProvider } from "@/contexts/MovieContext";
import AppInitializer from "@/components/AppInitializer";

export const metadata: Metadata = {
  title: "MovieTracker - Your Personal Movie Collection",
  description: "Track and manage your personal movie collection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider theme={theme}>
          <MovieProvider>
            <AppInitializer />
            {children}
          </MovieProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
