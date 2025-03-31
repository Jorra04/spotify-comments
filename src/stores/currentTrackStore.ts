// store.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useCurrentTrackStore = create(
  persist(
    (set) => ({
      currentTrack: {
        uri: "",
        albumArt: "",
        title: "",
        artist: "",
      }, // Initial value is an default track object
      setCurrentTrack: (track) => set({ currentTrack: track }), // Action to set the current track
    }),
    {
      name: "current-track", // Key for localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage as the storage
    }
  )
);

export default useCurrentTrackStore;
