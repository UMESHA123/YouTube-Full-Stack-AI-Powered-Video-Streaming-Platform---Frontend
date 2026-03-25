"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Minimize2,
  Captions,
  SkipForward,
  PictureInPicture2,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Video, VideoPlay as VideoPlayType, VideoPlaylist } from "@/types/types";
import { useYoutubecontext } from "@/contextAPI/YoutubeContextAPI";

const VOLUME_STORAGE_KEY = "yt-clone-volume";
const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const CONTROLS_HIDE_DELAY_MS = 3000;

function formatTime(seconds: number): string {
  if (seconds == null || !Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type VideoPlayProps = {
  videoId: string;
  video: VideoPlayType;
  /** When provided, Next button uses this list (e.g. suggested videos from watch page) */
  suggestedVideoIds?: string[];
};

export const VideoPlayComponent: React.FC<VideoPlayProps> = ({ videoId, video, suggestedVideoIds }) => {
  const router = useRouter();
  const {
    videos,
    videoPlaylist,
    setVideoPlaylist,
    isVideoPlaylistActive,
    setIsVideoPlaylistActive,
  } = useYoutubecontext();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() => {
    if (typeof window === "undefined") return 1;
    const v = localStorage.getItem(VOLUME_STORAGE_KEY);
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 && n <= 1 ? n : 1;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiPSupported] = useState(() =>
    typeof document !== "undefined" && "pictureInPictureEnabled" in document
  );
  const [isMiniPlayerOpen, setIsMiniPlayerOpen] = useState(false);
  const isLiveVideo = !!video?.isLive;

  const savedVolumeRef = useRef(volume);

  const togglePlayPause = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => setVideoError("Playback failed"));
    } else {
      el.pause();
    }
  }, []);

  const handlePlay = useCallback(() => setIsPlaying(true), []);
  const handlePause = useCallback(() => setIsPlaying(false), []);
  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    if (isVideoPlaylistActive && videoPlaylist.length > 0) {
      const idx = videoPlaylist.findIndex((v: VideoPlaylist) => v._id === videoId);
      if (idx >= 0 && idx < videoPlaylist.length - 1) {
        router.push(`/watch?v=${videoPlaylist[idx + 1]._id}`);
        return;
      }
    }
    if (suggestedVideoIds && suggestedVideoIds.length > 0) {
      const idx = suggestedVideoIds.indexOf(videoId);
      if (idx >= 0 && idx < suggestedVideoIds.length - 1 && suggestedVideoIds[idx + 1]) {
        router.push(`/watch?v=${suggestedVideoIds[idx + 1]}`);
        return;
      }
    }
    if (videos.length > 0) {
      const idx = videos.findIndex((v: Video) => v._id === videoId);
      const nextIdx = idx < 0 ? 0 : (idx + 1) % videos.length;
      if (videos[nextIdx]?._id) router.push(`/watch?v=${videos[nextIdx]._id}`);
    }
  }, [videoId, isVideoPlaylistActive, videoPlaylist, videos, suggestedVideoIds, router]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.addEventListener("play", handlePlay);
    el.addEventListener("pause", handlePause);
    el.addEventListener("ended", handleEnded);
    return () => {
      el.removeEventListener("play", handlePlay);
      el.removeEventListener("pause", handlePause);
      el.removeEventListener("ended", handleEnded);
    };
  }, [handlePlay, handlePause, handleEnded]);

  // Reset state when video source changes
  useEffect(() => {
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setVideoError(null);
    setIsPlaying(false);
  }, [videoId, video?.videoFile]);

  // Progress & time sync
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const onTimeUpdate = () => {
      if (Number.isFinite(el.duration) && el.duration > 0) {
        setProgress((el.currentTime / el.duration) * 100);
        setCurrentTime(el.currentTime);
      }
    };
    const onLoadedMetadata = () => {
      if (Number.isFinite(el.duration)) setDuration(el.duration);
    };
    const onDurationChange = () => {
      if (Number.isFinite(el.duration)) setDuration(el.duration);
    };

    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("loadedmetadata", onLoadedMetadata);
    el.addEventListener("durationchange", onDurationChange);
    return () => {
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("loadedmetadata", onLoadedMetadata);
      el.removeEventListener("durationchange", onDurationChange);
    };
  }, [videoId]);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isLiveVideo) return;
      const el = videoRef.current;
      if (!el || !Number.isFinite(el.duration) || el.duration <= 0) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      el.currentTime = pct * el.duration;
      setProgress(pct * 100);
      setCurrentTime(el.currentTime);
    },
    [isLiveVideo]
  );

  const goToLiveEdge = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (Number.isFinite(el.duration) && el.duration > 0) {
      el.currentTime = Math.max(0, el.duration - 1);
    }
    el.play().catch(() => setVideoError("Playback failed"));
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (videoRef.current) videoRef.current.volume = v;
    try {
      localStorage.setItem(VOLUME_STORAGE_KEY, String(v));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.volume = volume;
  }, [volume]);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setVolume(savedVolumeRef.current);
      if (videoRef.current) videoRef.current.volume = savedVolumeRef.current;
    } else {
      savedVolumeRef.current = volume;
      setVolume(0);
      if (videoRef.current) videoRef.current.volume = 0;
    }
    setIsMuted(!isMuted);
  }, [isMuted, volume]);

  const handleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    try {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        container.requestFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen error:", err);
    }
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const handlePiP = useCallback(async () => {
    const el = videoRef.current;
    if (!el) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await el.requestPictureInPicture();
      }
    } catch {
      /* PiP not allowed or not supported */
    }
  }, []);

  const handleNextVideo = useCallback(() => {
    if (isVideoPlaylistActive && videoPlaylist.length > 0) {
      const idx = videoPlaylist.findIndex((v: VideoPlaylist) => v._id === videoId);
      if (idx >= 0 && idx < videoPlaylist.length - 1) {
        router.push(`/watch?v=${videoPlaylist[idx + 1]._id}`);
        return;
      }
    }
    if (suggestedVideoIds && suggestedVideoIds.length > 0) {
      const idx = suggestedVideoIds.indexOf(videoId);
      const nextIdx = idx < 0 ? 0 : idx + 1;
      if (nextIdx < suggestedVideoIds.length && suggestedVideoIds[nextIdx]) {
        router.push(`/watch?v=${suggestedVideoIds[nextIdx]}`);
        return;
      }
    }
    if (videos.length > 0) {
      const idx = videos.findIndex((v: Video) => v._id === videoId);
      const nextIdx = idx < 0 ? 0 : (idx + 1) % videos.length;
      if (videos[nextIdx]?._id) router.push(`/watch?v=${videos[nextIdx]._id}`);
    }
  }, [videoId, videos, videoPlaylist, isVideoPlaylistActive, suggestedVideoIds, router]);

  const toggleCaptions = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    const tracks = el.textTracks;
    for (let i = 0; i < tracks.length; i++) {
      tracks[i].mode = tracks[i].mode === "showing" ? "hidden" : "showing";
    }
  }, []);

  const setSpeed = useCallback((rate: number) => {
    if (videoRef.current) videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  }, []);

  // Keyboard shortcuts (focus container so Space works after click)
  const focusContainer = useCallback(() => {
    containerRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (!container.contains(document.activeElement)) return;
      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlayPause();
          break;
        case "f":
        case "F":
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            handleFullscreen();
          }
          break;
        case "m":
        case "M":
          e.preventDefault();
          toggleMute();
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (!isLiveVideo && videoRef.current && Number.isFinite(videoRef.current.duration)) {
            videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          if (!isLiveVideo && videoRef.current && Number.isFinite(videoRef.current.duration)) {
            videoRef.current.currentTime = Math.min(
              videoRef.current.duration,
              videoRef.current.currentTime + 5
            );
          }
          break;
        default:
          break;
      }
    };

    container.addEventListener("keydown", onKeyDown);
    return () => container.removeEventListener("keydown", onKeyDown);
  }, [togglePlayPause, handleFullscreen, toggleMute, isLiveVideo]);

  // Controls auto-hide
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsHideTimerRef.current) {
      clearTimeout(controlsHideTimerRef.current);
      controlsHideTimerRef.current = null;
    }
    if (isPlaying) {
      controlsHideTimerRef.current = setTimeout(() => setShowControls(false), CONTROLS_HIDE_DELAY_MS);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) setShowControls(true);
    else resetControlsTimer();
    return () => {
      if (controlsHideTimerRef.current) clearTimeout(controlsHideTimerRef.current);
    };
  }, [isPlaying, resetControlsTimer]);

  const handleDoubleClick = useCallback(() => {
    handleFullscreen();
  }, [handleFullscreen]);

  const handleVideoError = useCallback(() => {
    setVideoError("Video failed to load. The file may be missing or in an unsupported format.");
  }, []);

  if (!video?.videoFile) {
    return (
      <div className="relative w-full aspect-video bg-black rounded-xl flex items-center justify-center">
        <p className="text-gray-400">No video source available.</p>
      </div>
    );
  }

  const wrapperClassName = isMiniPlayerOpen
    ? "fixed bottom-6 right-6 z-[100] w-[360px] aspect-video rounded-xl overflow-hidden shadow-2xl border border-[#333] bg-black"
    : "relative w-full aspect-video";

  return (
    <div className={wrapperClassName}>
      {isMiniPlayerOpen && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setIsMiniPlayerOpen(false); }}
          className="absolute top-2 right-2 z-30 p-1.5 rounded-full bg-black/70 hover:bg-black/90 text-white transition-colors"
          aria-label="Restore video"
          title="Restore"
        >
          <Maximize className="w-4 h-4" />
        </button>
      )}
      <div
        ref={containerRef}
        tabIndex={0}
        className="relative w-full h-full bg-black group rounded-xl overflow-hidden shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-inset"
        onMouseMove={resetControlsTimer}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        onDoubleClick={handleDoubleClick}
        onClick={(e) => { if (!(e.target as HTMLElement).closest("button")) focusContainer(); }}
      >
      <div className="absolute inset-0 flex items-center justify-center">
        <video
          ref={videoRef}
          src={video.videoFile}
          className="w-full h-full object-contain"
          crossOrigin="anonymous"
          playsInline
          preload="metadata"
          onError={handleVideoError}
        />
      </div>

      {videoError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 p-4">
          <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
          <p className="text-white text-center text-sm mb-3">{videoError}</p>
          <button
            type="button"
            onClick={() => {
              setVideoError(null);
              videoRef.current?.load();
            }}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      )}

      {/* Big play overlay – clickable area has pointer-events */}
      {!isPlaying && !videoError && (
        <div
          className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
          onClick={togglePlayPause}
          onKeyDown={(e) => e.key === "Enter" && togglePlayPause()}
          role="button"
          tabIndex={0}
          aria-label="Play"
        >
          <div className="w-20 h-20 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm pointer-events-none">
            <Play className="w-10 h-10 text-white fill-white ml-1 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Controls – gradient class fixed, visibility from state */}
      <div
        className={`absolute bottom-0 left-0 right-0 px-4 pb-4 pt-12 bg-linear-to-t from-black/85 via-black/40 to-transparent transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        {!isLiveVideo && (
          <div
            className="w-full h-1.5 bg-gray-600 rounded-full mb-4 cursor-pointer group/progress relative"
            onClick={handleSeek}
            role="slider"
            aria-label="Seek"
            tabIndex={0}
          >
            <div
              className="absolute top-0 left-0 h-full bg-red-600 rounded-full transition-[width]"
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 -ml-1.5 w-3 h-3 bg-red-600 rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"
              style={{ left: `${Math.max(0, Math.min(100, progress))}%` }}
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}
              className="text-white hover:text-gray-200 transition-colors p-1"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-current" />
              ) : (
                <Play className="w-7 h-7 fill-current ml-0.5" />
              )}
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleNextVideo(); }}
              className="text-white hover:text-gray-200 p-1"
              aria-label="Next video"
            >
              <SkipForward className="w-6 h-6 fill-current" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1 group/vol">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); toggleMute(); }}
              className="text-white hover:text-gray-200 p-1"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </button>
              <div className="w-0 overflow-hidden group-hover/vol:w-20 transition-all duration-200">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 ml-1 accent-red-600 cursor-pointer h-1"
                />
              </div>
            </div>

            {isLiveVideo ? (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-semibold text-red-400">LIVE</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToLiveEdge();
                  }}
                  className="text-xs text-white bg-red-600/80 hover:bg-red-600 px-2 py-0.5 rounded"
                >
                  Go Live
                </button>
              </div>
            ) : (
              <span className="text-xs text-gray-300 font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-white">
            {/* Playback speed */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowSpeedMenu((s) => !s); }}
                className="hover:text-gray-200 px-2 py-1 text-xs font-medium min-w-12"
                aria-label="Playback speed"
              >
                {playbackRate}x
              </button>
              {showSpeedMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowSpeedMenu(false)}
                    aria-hidden
                  />
                  <div className="absolute bottom-full right-0 mb-1 bg-[#282828] rounded-lg py-1 z-20 min-w-16 shadow-xl">
                    {SPEEDS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSpeed(s)}
                        className={`block w-full text-left px-3 py-1.5 text-sm hover:bg-[#3f3f3f] ${
                          playbackRate === s ? "text-red-500 font-medium" : "text-white"
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              className="hover:text-gray-200 p-1"
              onClick={(e) => { e.stopPropagation(); toggleCaptions(); }}
              aria-label="Toggle captions"
            >
              <Captions className="w-5 h-5" />
            </button>
            {isPiPSupported && (
              <button
                type="button"
                className="hover:text-gray-200 p-1"
                onClick={(e) => { e.stopPropagation(); handlePiP(); }}
                aria-label="Picture in picture"
              >
                <PictureInPicture2 className="w-5 h-5" />
              </button>
            )}
            <button
              type="button"
              className="hover:text-gray-200 p-1"
              onClick={(e) => { e.stopPropagation(); handleFullscreen(); }}
              aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5" />
              ) : (
                <Maximize className="w-5 h-5" />
              )}
            </button>
            <button
              type="button"
              className="hover:text-gray-200 p-1"
              onClick={(e) => {
                e.stopPropagation();
                if (document.fullscreenElement) document.exitFullscreen();
                setIsMiniPlayerOpen(true);
              }}
              aria-label="Popup player (bottom right)"
              title="Popup player"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
