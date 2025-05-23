"use client";
import cx from "classnames";
import styles from "./styles.module.css";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
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
  VolumeOff,
} from "lucide-react";
import { usePlayback } from "@/contexts";
import { loadSpotifyPlayer } from "@/utils";
import { VOLUME_MIN, VOLUME_MAX, VOLUME_DEFAULT } from "@/constants";
import NowPlaying from "./NowPlaying";
import { useSpotifyApi } from "@/effects";
import { millisToFormattedTime } from "@/utils/millisToFormattedTime";
import { useAuthenticationStore, usePlaybackStateStore } from "@/stores";
import { Slider } from "@mui/material";
import QueueTray from "./QueueTray";

const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};

export default function Playback() {
  const [isPaused, setIsPaused] = useState(true);
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const tokenRef = useRef<string | null>(null); // Store the latest token reference
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(VOLUME_DEFAULT);
  const [duration, setDuration] = useState(0);
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  const [isMuted, setIsMuted] = useState(false);
  const { playSong } = useSpotifyApi();

  const { albumArt, title, artist, uri, id, setCurrentTrack, queue, setQueue } =
    usePlaybackStateStore(
      useShallow((state) => ({
        albumArt: state.currentTrack?.albumArt,
        title: state.currentTrack?.title,
        artist: state.currentTrack?.artist,
        uri: state.currentTrack?.uri,
        id: state.currentTrack?.id,
        setCurrentTrack: state.setCurrentTrack,
        queue: state.queue,
        setQueue: state.setQueue,
      }))
    );

  const { bearerToken } = useAuthenticationStore(useShallow((state) => state));

  const handleMutePressed = () => {
    setIsMuted((muted) => {
      const newVolume = muted ? VOLUME_DEFAULT : 0;
      setVolume(newVolume);
      player?.setVolume(newVolume / 100);
      return !muted;
    });
  };

  const playerReadyHandler = ({ device_id }: { device_id: string }) => {
    console.log("+++ Player Ready with Device ID:", device_id);
    setDeviceId(device_id);
    setIsPaused(true);
  };

  const playerStateChangedHandler = (state: Spotify.PlaybackState) => {
    console.log("+++ Player state changed:", state);
    const { paused: _isPaused, position, duration: _duration } = state;
    setCurrentTime(position ?? 0);
    setDuration(_duration ?? 0);
    setIsPaused(_isPaused ?? true);

    if (
      state?.track_window?.current_track?.uri &&
      uri !== state.track_window.current_track.uri
    ) {
      const {
        name,
        uri: newTrackURI,
        album: newTrackAlbum,
        artists: newTrackArtists,
        id: newTrackId,
      } = state.track_window.current_track;
      const imagePath =
        newTrackAlbum?.images[0]?.url || "/assets/albumPlaceholder.svg";
      const artistName = newTrackArtists
        ?.map((artist) => artist.name)
        .join(", ");
      setCurrentTrack({
        uri: newTrackURI,
        albumArt: imagePath,
        title: name,
        artist: artistName,
        id: newTrackId,
      });
    }
  };

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

    tempPlayer.addListener("ready", playerReadyHandler);

    tempPlayer.addListener("player_state_changed", playerStateChangedHandler);

    const success = await tempPlayer.connect();
    if (success) {
      console.log("+++ Player connected successfully");
      setPlayer(tempPlayer);
    } else {
      console.error("+++ Failed to connect to Spotify");
    }
  };

  const handleComponentMount = async () => {
    // Store the token in ref to ensure it is always available
    tokenRef.current = bearerToken;

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
    console.log("+++ Mounting component with bearerToken:", bearerToken);

    handleComponentMount();

    return () => {
      player?.disconnect();
    };
  }, [bearerToken]);

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

      const response = await playSong(uri, deviceId);

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
    console.log("+++newvolume", newVolume, newVolume > 1);
    player?.setVolume(newVolume / 100);
    setIsMuted(newVolume <= 0);
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
    if (player) {
      player.addListener("ready", playerReadyHandler);
      player.addListener("player_state_changed", playerStateChangedHandler);
    }

    return () => {
      player?.removeListener("ready", playerReadyHandler);
      player?.removeListener("player_state_changed", playerStateChangedHandler);
    };
  }, [player, playerStateChangedHandler]);

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
        <NowPlaying
          albumArtPath={albumArt}
          title={title}
          artist={artist}
          id={id}
        />
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
          <Slider
            defaultValue={0}
            aria-label="playback seek"
            value={currentTime}
            min={0}
            max={duration}
            onChange={handleSeek}
            sx={{
              color: "#1DB954", // Spotify green for the played section
              "& .MuiSlider-thumb": {
                color: "#1DB954", // Thumb color
              },
              "& .MuiSlider-rail": {
                color: "#404040", // Unplayed section (rail)
              },
              "& .MuiSlider-track": {
                color: "#1DB954", // Played section (track)
              },
              "&:hover .MuiSlider-thumb": {
                boxShadow: "0 0 0 8px rgba(29,185,84,0.16)", // Thumb glow on hover
              },
            }}
          />
          <span className={styles.playbackTime}>{formattedDuration}</span>
        </div>
      </div>
      <div className={styles.audioPlaybackContainer}>
        <MicVocal color="white" size={24} />
        <ListMusic
          color="white"
          size={24}
          onClick={() => setIsQueueOpen(true)}
        />
        <MonitorSpeaker color="white" size={24} />
        {isMuted ? (
          <VolumeOff color="white" size={24} onClick={handleMutePressed} />
        ) : (
          <Volume2 color="white" size={24} onClick={handleMutePressed} />
        )}

        <input
          type="range"
          min={VOLUME_MIN}
          max={VOLUME_MAX}
          value={volume}
          onChange={handleVolumeChange}
          className={styles.volumeSlider}
        />
      </div>
      <QueueTray
        isOpen={isQueueOpen}
        setIsOpen={setIsQueueOpen}
        queue={queue}
      />
    </div>
  );
}
