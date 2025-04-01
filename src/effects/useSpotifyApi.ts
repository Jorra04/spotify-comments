"use client";
import { useSpotify } from "@/contexts";
import { useAuthenticationStore } from "@/stores";
import { useShallow } from "zustand/shallow";

export interface SearchResult {
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
      uri: string;
      id: string;
    }[];
  };
  albums: {
    items: {
      name: string;
      images: { url: string; height: number; width: number }[];
      release_date: string;
      total_tracks: number;
    }[];
  };
  playlists: {
    items: {
      name: string;
      images: { url: string; height: number; width: number }[];
      owner: {
        display_name: string;
      };
      description: string;
      tracks: {
        total: number;
      };
    }[];
  };
}

const useSpotifyApi = () => {
  const { bearerToken } = useAuthenticationStore(useShallow((state) => state));
  const baseUrl = "https://api.spotify.com/v1";

  const normalizeSearchResults = (results: any): SearchResult => {
    const {
      artists: { items: artistItems = [] } = { items: [] },
      tracks: { items: trackItems = [] } = { items: [] },
      albums: { items: albumItems = [] } = { items: [] },
      playlists: { items: playlistItems = [] } = { items: [] },
    } = results;

    const normalizedResults = {
      artists: {
        items: artistItems?.map(({ images = [], name = "", genres = [] }) => ({
          images: images.map(({ url = "", height = 0, width = 0 }) => ({
            url,
            height,
            width,
          })),
          name,
          genres,
        })),
      },
      tracks: {
        items: trackItems?.map(
          ({ name = "", artists = [], album = {}, uri = "", id = "" }) => ({
            name,
            artists: artists.map(({ name = "" }) => ({ name })),
            album: {
              name: album.name || "",
              images: (album.images || []).map(
                ({ url = "", height = 0, width = 0 }) => ({
                  url,
                  height,
                  width,
                })
              ),
              release_date: album.release_date || "",
            },
            uri,
            id,
          })
        ),
      },
      albums: {
        items: albumItems?.map(
          ({
            name = "",
            images = [],
            release_date = "",
            total_tracks = 0,
          }) => ({
            name,
            images: images.map(({ url = "", height = 0, width = 0 }) => ({
              url,
              height,
              width,
            })),
            release_date: release_date || "",
            total_tracks: total_tracks || 0,
          })
        ),
      },
      // playlists: {
      //   items:
      //     playlistItems
      //       ?.filter((item) => !!item)
      //       .map(({ name = "", images = [], owner = {} }) => ({
      //         name,
      //         images: images.map(({ url = "", height = 0, width = 0 }) => ({
      //           url,
      //           height,
      //           width,
      //         })),
      //         owner: owner.display_name || "",
      //       })) || [],
      // },
    };
    console.log("+++", normalizedResults);
    return normalizedResults;
  };

  const search = async (query: string, options: { type: string }) => {
    const response = await fetch(
      `${baseUrl}/search?q=${query}&type=${options.type}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );

    const data = await response.json();
    return normalizeSearchResults(data);
  };

  const playSong = async (trackUri: string, deviceId: string) => {
    const response = await fetch(
      `${baseUrl}/me/player/play?device_id=${deviceId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: [trackUri],
        }),
      }
    );

    return response;
  };

  return { search, playSong };
};

export default useSpotifyApi;
