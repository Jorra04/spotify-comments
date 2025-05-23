import { useShallow } from "zustand/shallow";
import { getFirstValue } from "@/utils";
import styles from "./styles.module.css";
import { usePlayback } from "@/contexts";
import { usePlaybackStateStore } from "@/stores";
import { Menu, MenuItem, Tooltip } from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { EllipsisVertical } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useSpotifyApi from "@/effects/useSpotifyApi";
export default function Track({ item }) {
  if (!item) {
    console.log("+++item", item);
    return null;
  }

  const { setCurrentTrack, setQueue, queue } = usePlaybackStateStore(
    useShallow((state) => state)
  );
  const router = useRouter();

  const { addToQueue } = useSpotifyApi();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(null);
  };

  const imagePath =
    item?.album?.images[0]?.url || "/assets/albumPlaceholder.svg";
  const artistName = item?.artists?.map((artist) => artist.name).join(", ");
  const trackName = item?.name;

  const handleTrackSelection = () => {
    setCurrentTrack({
      uri: item?.uri,
      albumArt: imagePath,
      title: trackName,
      artist: artistName,
      id: item?.id,
    });
  };

  const options = useMemo(
    () => [
      {
        label: "Add to queue",
        onClick: async (e: React.MouseEvent<HTMLElement>) => {
          e.stopPropagation();
          console.log("add to queue");
          addToQueue(item?.uri);
          setQueue([
            ...queue,
            {
              uri: item?.uri,
              albumArt: imagePath,
              title: trackName,
              artist: artistName,
              id: item?.id,
            },
          ]);
          handleClose();
        },
      },
      {
        label: "Add to liked songs",
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          e.stopPropagation();
          console.log("add to liked songs");
          handleClose();
        },
      },
      {
        label: "Play",
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          e.stopPropagation();
          handleTrackSelection();
          handleClose();
        },
      },
      {
        label: "More info",
        onClick: () => {
          router.push(`/search/track/${item?.id}`);
          handleClose();
        },
      },
    ],
    [item, handleTrackSelection, router]
  );

  return (
    <div
      className={styles.trackButton}
      role="button"
      aria-label={"play song"}
      onClick={handleTrackSelection}
    >
      <div className={styles.trackContainer}>
        <div className={styles.coverArtContainer}>
          <img
            className={styles.coverArt}
            src={imagePath || null}
            alt={item?.album?.name}
            width={120}
            height={120}
          />
        </div>

        <div className={styles.trackInfo}>
          <Tooltip title={trackName} arrow>
            <h3 className={styles.trackName}>{trackName}</h3>
          </Tooltip>
          <div className={styles.albumInfo}>
            <Tooltip title={artistName} arrow>
              <h4 className={styles.artistName}>{artistName}</h4>
            </Tooltip>

            <span className={styles.divider}>•</span>
            <p className={styles.albumReleaseDate}>
              {getFirstValue(item?.album?.release_date)}
            </p>
            <div className={styles.optionsContainer}>
              <EllipsisVertical
                size={16}
                className={styles.optionsIcon}
                color="white"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault(); // Prevent the click from bubbling up to the parent div
                  handleClick(e);
                }}
              />
              <Menu
                id="long-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleClose(e);
                }}
                MenuListProps={{
                  "aria-labelledby": "long-button",
                }}
                slotProps={{
                  paper: {
                    style: {
                      maxHeight: 216,
                      width: "20ch",
                      backgroundColor: "var(--spotify-dark-gray)",
                      color: "white",
                    },
                  },
                }}
              >
                {options.map((option) => (
                  <MenuItem key={option.label} onClick={option.onClick}>
                    {option.label}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
