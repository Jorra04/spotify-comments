"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type SpotifyContextType = {
  bearerToken?: string;
};

type SpotifyProviderProps = {
  children: ReactNode;
  bearerToken: string;
};

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

export function SpotifyProvider({
  children,
  bearerToken,
}: SpotifyProviderProps) {
  const spotifyContextProps = {
    bearerToken,
  };

  return (
    <SpotifyContext.Provider value={spotifyContextProps}>
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  return useContext(SpotifyContext);
};
