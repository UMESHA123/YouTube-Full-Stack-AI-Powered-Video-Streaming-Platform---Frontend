"use client";
import { Video, VideoPlaylist } from "@/types/types";
import React, { useCallback } from "react";
import PlaylistInfo from "./PlaylistInfo";
import VideoRow from "./VideoRow";
import { Loader2 } from "lucide-react";
import { useYoutubecontext } from "@/contextAPI/YoutubeContextAPI";
import { useRouter } from "next/navigation";

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

type PlaylistViewType = {
  videos: VideoPlaylist[];
  playlistType: string;
  loading: boolean;
};

const PlaylistView: React.FC<PlaylistViewType> = ({ videos, playlistType, loading }) => {
  const router = useRouter();
  const { setVideoPlaylist, setIsVideoPlaylistActive, setPlaylistLabel } = useYoutubecontext();

  const handlePlayAll = useCallback(() => {
    if (videos.length === 0) return;
    setVideoPlaylist(videos);
    setPlaylistLabel(playlistType);
    setIsVideoPlaylistActive(true);
    router.push(`/watch?v=${videos[0]._id}`);
  }, [videos, setVideoPlaylist, setPlaylistLabel, setIsVideoPlaylistActive, playlistType, router]);

  const handleShuffle = useCallback(() => {
    if (videos.length === 0) return;
    const shuffled = shuffleArray(videos);
    setVideoPlaylist(shuffled);
    setPlaylistLabel(playlistType);
    setIsVideoPlaylistActive(true);
    router.push(`/watch?v=${shuffled[0]._id}`);
  }, [videos, setVideoPlaylist, setPlaylistLabel, setIsVideoPlaylistActive, playlistType, router]);

  return (
    <React.Fragment>
      {loading ? (
        <Loader2 className="h-15 w-15 animate-spin" />
      ) : videos?.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-6 max-w-[1800px] mx-auto">
          <div className="shrink-0">
            <PlaylistInfo playlistType={playlistType} />
          </div>
          <div className="flex-1 flex flex-col gap-2 pb-20 md:pb-0 px-4 md:px-0">
            <div className="lg:hidden flex gap-4 items-center mb-4 mt-4">
              <button onClick={handlePlayAll} className="bg-white text-black rounded-full px-6 py-2 text-sm font-medium">
                Play all
              </button>
              <button onClick={handleShuffle} className="bg-[#272727] text-white rounded-full px-6 py-2 text-sm font-medium">
                Shuffle
              </button>
            </div>
            {videos.map((video, index) => (
              <VideoRow key={video._id} video={video} index={index} />
            ))}
          </div>
        </div>
      ) : (
        "No liked video"
      )}
    </React.Fragment>
  );
};

export default PlaylistView