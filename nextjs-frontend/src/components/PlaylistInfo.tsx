"use client";
import { useYoutubecontext } from "@/contextAPI/YoutubeContextAPI";
import { VideoPlaylist } from "@/types/types";
import { timeAgo } from "@/utills";
import { Download, MoreVertical, Play, Shuffle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

type PlaylistInfoType = { playlistType: string };
const PlaylistInfo: React.FC<PlaylistInfoType> = ({ playlistType }) => {
  const router = useRouter();
  const { videoPlaylist: videos, setVideoPlaylist, setIsVideoPlaylistActive, setPlaylistLabel } = useYoutubecontext();
  const firstVideo = videos[0];
  const bgImage = firstVideo ? firstVideo?.thumbnail : "https://picsum.photos/400/800";

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
    <div className="lg:w-[360px] lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 p-6 flex flex-col gap-6 rounded-xl overflow-hidden relative group">
            {/* Dynamic Background Blur Effect */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center blur-3xl opacity-40 scale-150"
                style={{ backgroundImage: `url(${bgImage})` }}
            ></div>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 z-0 bg-linear-to-b from-black/20 via-[#0f0f0f]/80 to-[#0f0f0f]"></div>

            {/* Content */}
            <div className="z-10 flex flex-col h-full">
                <div className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl mb-4 relative hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
                    <img
                        src={bgImage}
                        alt="Playlist Thumbnail"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">
                        {videos.length} videos
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{playlistType}</h1>
                        <p className="text-white font-medium text-sm"></p>
                        <div className="text-gray-400 text-xs flex gap-1 mt-1">
                            <span>{videos.length} videos</span>
                            <span>•</span>
                            <span>{firstVideo?.views} views</span>
                            <span>•</span>
                            <span>{timeAgo(firstVideo?.createdAt)}</span>
                        </div>
                    </div>

                    <div className="flex gap-2 w-full">
                        <button onClick={handlePlayAll} className="bg-white text-black rounded-full px-4 py-2 flex-1 flex items-center justify-center gap-2 font-medium hover:bg-gray-200 transition-colors">
                            <Play size={20} fill="currentColor" /> Play all
                        </button>
                        <button onClick={handleShuffle} className="bg-white/10 text-white rounded-full px-4 py-2 flex-1 flex items-center justify-center gap-2 font-medium hover:bg-white/20 transition-colors">
                            <Shuffle size={20} /> Shuffle
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full hover:bg-white/10 text-white transition-colors">
                            <Download size={20} />
                        </button>
                        <button className="p-2 rounded-full hover:bg-white/10 text-white transition-colors">
                            <MoreVertical size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default PlaylistInfo