import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const usePlaybackStateStore = create(
  persist(
    (set) => ({
      currentTrack: {
        uri: "",
        albumArt: "",
        title: "",
        artist: "",
        id: "",
      },
      queue: [],
      setQueue: (queue) => set({ queue }),
      setCurrentTrack: (track) => set({ currentTrack: track }),
    }),
    {
      name: "playback-state",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default usePlaybackStateStore;
