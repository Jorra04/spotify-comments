import cx from "classnames";
import styles from "./styles.module.css";
import { useEffect, useState, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";

import { loadSpotifyPlayer } from "@/utils";

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

  const handlePlayback = async (
    trackUri: string = "spotify:track:1Yk0cQdMLx5RzzFTYwmuld"
  ) => {
    if (!deviceId) {
      console.error("+++ Device ID is not available yet.");
      return;
    }

    const action = isPaused ? "play" : "pause";
    const url = `https://api.spotify.com/v1/me/player/${action}?device_id=${deviceId}`;
    setIsPaused(!isPaused);

    try {
      console.log(`+++ Playing track: ${trackUri} on device ${deviceId}`);

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: [trackUri],
        }),
      });

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

  return (
    <div className={styles.playbackContainer}>
      <SkipBack color="white" onClick={() => player?.previousTrack()} />
      {isPaused ? (
        <Play color="white" onClick={() => handlePlayback()} />
      ) : (
        <Pause color="white" onClick={() => handlePlayback()} />
      )}
      <SkipForward color="white" onClick={() => player?.nextTrack()} />
    </div>
  );
}
