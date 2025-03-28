"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { SearchResult } from "@/effects/useSpotifyApi";

type SearchContextType = {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  searchResults: SearchResult | null;
  setSearchResults: (results: SearchResult | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "track",
  ]);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SearchContext.Provider
      value={{
        selectedCategories,
        setSelectedCategories,
        searchResults,
        setSearchResults,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
