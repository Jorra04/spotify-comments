"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type PlaybackContextType = {
  selectedSong: string;
  setSelectedSong: (song: string) => void;
};

const PlaybackContext = createContext<PlaybackContextType | undefined>(
  undefined
);

export function PlaybackProvider({ children }: PlaybackProviderProps) {
  const [selectedSong, setSelectedSong] = useState<string>("");
  return (
    <PlaybackContext.Provider
      value={{
        selectedSong,
        setSelectedSong,
      }}
    >
      {children}
    </PlaybackContext.Provider>
  );
}

export const usePlayback = () => {
  const context = useContext(PlaybackContext);
  if (context === undefined) {
    throw new Error("usePlayback must be used within a PlaybackProvider");
  }
  return context;
};
