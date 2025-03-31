import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useSearchHistoryStore = create(
  persist(
    (set) => ({
      searchHistory: [],
      setSearchHistory: (history) => set({ searchHistory: history }),
    }),
    {
      name: "search-history",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useSearchHistoryStore;
