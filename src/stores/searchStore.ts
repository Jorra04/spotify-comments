import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SearchResult {
  artists: {
    items: {
      images: { url: string; height: number; width: number }[];
    }[];
    name: string;
    genres: string[];
  };
  tracks: {
    items: {
      name: string;
      artists: {
        name: string;
      }[];
      album: {
        name: string;
        images: { url: string; height: number; width: number }[];
        release_date: string;
      };
    }[];
  };
}

interface SearchStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult;
  setSearchResults: (results: SearchResult) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}

const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
      searchResults: [],
      setSearchResults: (results) => set({ searchResults: results }),
      selectedCategories: ["track"],
      setSelectedCategories: (categories) =>
        set({ selectedCategories: categories }),
    }),
    {
      name: "search-store", // LocalStorage key
      storage: createJSONStorage(() => localStorage), // Use localStorage
    }
  )
);

export default useSearchStore;
