"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type PlaybackContextType = {
  selectedSong: string;
  setSelectedSong: (song: string) => void;
  selectedSongImage: string;
  setSelectedSongImage: (image: string) => void;
  title: string;
  setTitle: (title: string) => void;
  artist: string;
  setArtist: (artist: string) => void;
};

const PlaybackContext = createContext<PlaybackContextType | undefined>(
  undefined
);

export function PlaybackProvider({ children }: PlaybackProviderProps) {
  const [selectedSong, setSelectedSong] = useState<string>("");
  const [selectedSongImage, setSelectedSongImage] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [artist, setArtist] = useState<string>("");
  return (
    <PlaybackContext.Provider
      value={{
        selectedSong,
        setSelectedSong,
        selectedSongImage,
        setSelectedSongImage,
        title,
        setTitle,
        artist,
        setArtist,
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
