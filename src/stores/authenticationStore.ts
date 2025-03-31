// store.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthenticationStore = create(
  persist(
    (set) => ({
      bearerToken: "",
      setBearerToken: (bearerToken) => set({ bearerToken }),
    }),
    {
      name: "authentication", // Key for localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage as the storage
    }
  )
);

export default useAuthenticationStore;
