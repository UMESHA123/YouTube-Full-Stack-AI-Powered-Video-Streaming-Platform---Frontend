"use client";
import { useYoutubecontext } from "@/contextAPI/YoutubeContextAPI";
import { ChevronLeft, ChevronRight, Play, Shuffle, X } from "lucide-react";
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

type VideoPlaylistProps = {
  videoId: string;
  currentPage: number;
  ITEMS_PER_PAGE: number;
  totalPages: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
};

const VideoPlaylist: React.FC<VideoPlaylistProps> = ({
  videoId,
  currentPage,
  ITEMS_PER_PAGE,
  totalPages,
  handlePrevPage,
  handleNextPage,
}) => {
  const router = useRouter();
  const startIdx = currentPage * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const { videoPlaylist, setVideoPlaylist, setIsVideoPlaylistActive, playlistLabel, loginUserDetails } = useYoutubecontext();
  const currentVideos = videoPlaylist.slice(startIdx, endIdx);
  const currentIndex = videoPlaylist.findIndex((v) => v._id === videoId) + 1;

  const handleClose = useCallback(() => setIsVideoPlaylistActive(false), [setIsVideoPlaylistActive]);

  const handleShuffle = useCallback(() => {
    if (videoPlaylist.length === 0) return;
    const shuffled = shuffleArray(videoPlaylist);
    setVideoPlaylist(shuffled);
    router.push(`/watch?v=${shuffled[0]._id}`);
  }, [videoPlaylist, setVideoPlaylist, router]);

  return (
    <div className="flex flex-col h-full bg-[#0f0f0f] relative group">
      <div className="px-4 py-3 bg-[#212121] border-b border-[#303030] shrink-0 flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-white text-lg leading-tight">{playlistLabel || "Playlist"}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
              <span>{currentIndex} / {videoPlaylist.length}</span>
              <span>•</span>
              <span className="font-medium">{loginUserDetails?.username ?? ""}</span>
            </div>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors p-1" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <button onClick={handleShuffle} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors" title="Shuffle">
            <Shuffle size={18} />
          </button>
        </div>
      </div>

            {/* Playlist Items */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {currentVideos.map((v, idx) => {
                    const globalIndex = startIdx + idx;
                    const isActive = v._id === videoId;
                    return (
                        <div
                            key={v._id}
                            onClick={() => router.push(`/watch?v=${v._id}`)}
                            className={`flex gap-3 px-3 py-2 cursor-pointer transition-colors border-l-4 ${isActive
                                ? 'bg-[#2a2a2a] border-[#3ea6ff]'
                                : 'bg-transparent border-transparent hover:bg-[#272727]'
                                }`}
                        >
                            <div className="flex items-center justify-center w-6 shrink-0 text-xs font-medium text-gray-400">
                                {isActive ? <Play size={12} fill="white" className="text-white" /> : globalIndex + 1}
                            </div>

                            <div className="relative w-24 h-14 shrink-0 rounded-lg overflow-hidden bg-gray-800">
                                <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" />
                                <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded font-medium">{v.duration}</span>
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <h4 className={`text-sm font-medium line-clamp-2 leading-tight mb-1 ${isActive ? 'text-white' : 'text-gray-200'}`}>
                                    {v.title}
                                </h4>
                                <p className="text-xs text-gray-400">{v.owner?.username}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination Footer */}
            {totalPages > 1 && (
                <div className="px-4 py-2 bg-[#181818] border-t border-[#303030] flex items-center justify-between">
                    <button
                        type="button"
                        onClick={handlePrevPage}
                        disabled={currentPage === 0}
                        className="p-1.5 rounded-full hover:bg-[#303030] disabled:opacity-30 disabled:hover:bg-transparent text-gray-300 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-xs font-medium text-gray-400">
                        Page {currentPage + 1} of {totalPages}
                    </span>
                    <button
                        type="button"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages - 1}
                        className="p-1.5 rounded-full hover:bg-[#303030] disabled:opacity-30 disabled:hover:bg-transparent text-gray-300 transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    )
}

export default VideoPlaylist