"use client";
import cx from "classnames";
import styles from "./styles.module.css";
import { useEffect, useState, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { usePlayback } from "@/contexts";
import { loadSpotifyPlayer } from "@/utils";
import NowPlaying from "./NowPlaying";
import { useSpotifyApi } from "@/effects";
type PlaybackProps = {
  accessToken: string;
};

const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};

export default function Playback({ accessToken }: PlaybackProps) {
  const [isPaused, setIsPaused] = useState(true);
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const tokenRef = useRef<string | null>(null); // Store the latest token reference
  const [deviceId, setDeviceId] = useState<string | null>(null);

  const { selectedSong } = usePlayback();
  const { playSong, pauseSong } = useSpotifyApi();

  const initializePlayer = async () => {
    if (!window.Spotify) {
      console.error("+++ Spotify SDK not loaded yet.");
      return;
    }

    console.log("+++ Initializing player with token:", tokenRef.current);

    const tempPlayer = new window.Spotify.Player({
      name: "Web Playback SDK",
      getOAuthToken: (cb) => {
        const token = tokenRef.current;
        console.log("+++ Providing OAuth token:", token);
        cb(token ?? ""); // Fallback to empty string if null
      },
      volume: 0.5,
    });

    tempPlayer.addListener("ready", ({ device_id }) => {
      console.log("+++ Player Ready with Device ID:", device_id);
      setDeviceId(device_id);
    });

    tempPlayer.addListener("player_state_changed", (state) => {
      console.log("+++ Player state changed:", state);
      setIsPaused(state?.paused ?? true);
    });

    const success = await tempPlayer.connect();

    if (success) {
      console.log("+++ Connected to Spotify!");
      setPlayer(tempPlayer);
    } else {
      console.log("+++ Failed to connect!");
    }
  };

  const handleComponentMount = async () => {
    // Store the token in ref to ensure it is always available
    tokenRef.current = accessToken;

    if (!window.Spotify) {
      console.log("+++ Loading Spotify SDK...");
      await loadSpotifyPlayer();
    }

    // Ensure the SDK is ready before initializing the player
    if (!window.onSpotifyWebPlaybackSDKReady) {
      window.onSpotifyWebPlaybackSDKReady = () => {
        console.log("+++ Spotify SDK Ready, initializing player.");
        initializePlayer();
      };
    } else {
      initializePlayer();
    }
  };

  useEffect(() => {
    console.log("+++ Mounting component with accessToken:", accessToken);

    handleComponentMount();

    return () => {
      player?.disconnect();
    };
  }, [accessToken]);

  const handlePlaySong = async (trackUri: string = "") => {
    if (!deviceId) {
      console.error("+++ Device ID is not available yet.");
      return;
    }
    setIsPaused(false);

    try {
      console.log(`+++ Playing track: ${trackUri} on device ${deviceId}`);

      const response = await playSong(trackUri, deviceId, accessToken);

      if (!response.ok) {
        const error = await response.json();
        console.error("+++ Failed to play track:", error);
      } else {
        console.log("+++ Track is playing!");
      }
    } catch (error) {
      console.error("+++ Error playing track:", error);
    }
  };

  const handlePauseSong = async () => {
    if (!deviceId) {
      console.error("+++ Device ID is not available yet.");
      return;
    }
    setIsPaused(true);

    try {
      console.log(`+++ Pausing track on device ${deviceId}`);

      const response = await pauseSong(deviceId, accessToken);
      if (!response.ok) {
        const error = await response.json();
        console.error("+++ Failed to pause track:", error);
      } else {
        console.log("+++ Track is paused!");
      }
    } catch (error) {
      console.error("+++ Error pausing track:", error);
    }
  };

  useEffect(() => {
    if (selectedSong && deviceId) {
      console.log(
        "+++ Selected song changed, playing new track:",
        selectedSong
      );
      handlePlaySong(selectedSong);
      setIsPaused(false); // Update pause state since we're starting playback
    }
  }, [selectedSong, deviceId]);

  return (
    <div className={styles.playbackContainer}>
      <div className={styles.nowPlayingContainer}>
        <NowPlaying
          albumArtPath={
            "https://i.scdn.co/image/ab67616d0000b27390a50cfe99a4c19ff3cbfbdb"
          }
          title={"Stairway to Heaven"}
          artist={"Led Zeppelin"}
        />
      </div>
      <div className={styles.playbackControls}>
        <SkipBack color="white" onClick={() => player?.previousTrack()} />
        {isPaused ? (
          <Play color="white" onClick={() => handlePlaySong(selectedSong)} />
        ) : (
          <Pause color="white" onClick={() => handlePauseSong(selectedSong)} />
        )}
        <SkipForward color="white" onClick={() => player?.nextTrack()} />
      </div>
    </div>
  );
}
