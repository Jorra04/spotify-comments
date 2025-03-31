"use client";
import cx from "classnames";
import styles from "./styles.module.css";
import { useEffect, useState, useRef, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  MicVocal,
  MonitorSpeaker,
  ListMusic,
  Volume2,
} from "lucide-react";
import { usePlayback } from "@/contexts";
import { loadSpotifyPlayer } from "@/utils";
import { VOLUME_MIN, VOLUME_MAX, VOLUME_DEFAULT } from "@/constants";
import NowPlaying from "./NowPlaying";
import { useSpotifyApi } from "@/effects";
import { millisToFormattedTime } from "@/utils/millisToFormattedTime";
import { useCurrentTrackStore } from "@/stores";
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
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(VOLUME_DEFAULT);
  const [duration, setDuration] = useState(0);
  const { playSong, pauseSong } = useSpotifyApi();

  const { albumArt, title, artist, uri } = useCurrentTrackStore(
    useShallow((state) => ({
      albumArt: state.currentTrack?.albumArt,
      title: state.currentTrack?.title,
      artist: state.currentTrack?.artist,
      uri: state.currentTrack?.uri,
    }))
  );

  const initializePlayer = async () => {
    if (!window.Spotify) {
      // console.error("+++ Spotify SDK not loaded yet.");
      return;
    }

    console.log("+++ Initializing player with token:", tokenRef.current);

    const tempPlayer = new window.Spotify.Player({
      name: "Spotify Comments",
      getOAuthToken: (cb) => {
        const token = tokenRef.current;
        console.log("+++ Providing OAuth token:", token);
        cb(token ?? ""); // Fallback to empty string if null
      },
      volume: VOLUME_DEFAULT / 100,
    });

    tempPlayer.getVolume().then((volume) => {
      let volume_percentage = volume * 100;
      setVolume(volume_percentage);
    });

    tempPlayer.addListener("ready", ({ device_id }) => {
      console.log("+++ Player Ready with Device ID:", device_id);
      setDeviceId(device_id);
      setIsPaused(true);
    });

    tempPlayer.addListener("player_state_changed", (state) => {
      console.log("+++ Player state changed:", state);
      setCurrentTime(state?.position ?? 0);
      setDuration(state?.duration ?? 0);
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

  useEffect(() => {
    // Initialize the interval
    const intervalId = setInterval(() => {
      if (!isPaused) {
        setCurrentTime((prevCurrentTime) => prevCurrentTime + 1000);
      }
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [isPaused]);

  const handleResumeSong = async () => {
    if (!player) {
      console.error("+++ Player is not available yet.");
      return;
    }

    if (!uri) {
      console.error("+++ No track URI found.");
      return;
    }

    const playerState = await player.getCurrentState();
    console.log("+++ Player state:", playerState);
    if (!playerState) {
      console.log("+++ No player state found, playing track:", uri);
      handlePlaySong();
      return;
    }

    try {
      console.log(`+++ Resuming track: on device ${deviceId}`);
      player?.resume().then((success) => {
        console.log("+++ Resume successful:", success);
        setIsPaused(false);
      });
    } catch (error) {
      console.error("+++ Error resuming track:", error);
    }
  };

  const handlePausePlayback = async () => {
    if (!player) {
      console.error("+++ Player is not available yet.");
      return;
    }

    try {
      console.log(`+++ Pausing playback on device ${deviceId}`);
      player?.pause().then((success) => {
        console.log("+++ Pause successful:", success);
        setIsPaused(true);
      });
    } catch (error) {
      console.error("+++ Error pausing playback:", error);
    }
  };

  const handlePlaySong = async () => {
    if (!deviceId) {
      console.error("+++ Device ID is not available yet.");
      return;
    }
    setIsPaused(false);

    try {
      console.log(`+++ Playing track: ${uri} on device ${deviceId}`);

      const response = await playSong(uri, deviceId, accessToken);

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

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value);
    player?.seek(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    player?.setVolume(newVolume / 100);
    setVolume(newVolume);
  };

  const formattedCurrentTime = useMemo(
    () => millisToFormattedTime(currentTime),
    [currentTime]
  );

  const formattedDuration = useMemo(
    () => millisToFormattedTime(duration),
    [duration]
  );

  useEffect(() => {
    if (uri && deviceId) {
      player?.getCurrentState().then((state) => {
        if (!state) {
          return;
        }
        console.log("+++ Selected song changed, playing new track:", uri);
        handlePlaySong();
        setIsPaused(false); // Update pause state since we're starting playback
      });
    }
  }, [uri, deviceId]);

  return (
    <div className={styles.playbackContainer}>
      <div className={styles.nowPlayingContainer}>
        <NowPlaying albumArtPath={albumArt} title={title} artist={artist} />
      </div>
      <div className={styles.playbackControlsContainer}>
        <div className={styles.playbackControls}>
          <SkipBack color="white" onClick={() => player?.previousTrack()} />
          {isPaused ? (
            <Play color="white" onClick={() => handleResumeSong()} />
          ) : (
            <Pause color="white" onClick={() => handlePausePlayback()} />
          )}
          <SkipForward color="white" onClick={() => player?.nextTrack()} />
        </div>
        <div className={styles.playbackTimeContainer}>
          <span className={styles.playbackTime}>{formattedCurrentTime}</span>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className={styles.playbackSeek}
          />
          <span className={styles.playbackTime}>{formattedDuration}</span>
        </div>
      </div>
      <div className={styles.audioPlaybackContainer}>
        <MicVocal color="white" />
        <ListMusic color="white" />
        <MonitorSpeaker color="white" />
        <Volume2 color="white" />
        <input
          type="range"
          min={VOLUME_MIN}
          max={VOLUME_MAX}
          value={volume}
          onChange={handleVolumeChange}
          className={styles.volumeSlider}
        />
      </div>
    </div>
  );
}
