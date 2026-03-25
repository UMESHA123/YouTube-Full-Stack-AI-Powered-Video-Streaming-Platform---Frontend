"use client"
import { timeAgo } from '@/utills';
import { MoreVertical, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'

interface HistoryItemProps {
    video: any;
    removeVideoFromWatchHistoryHandler: (videoId: string) => void
}

const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const mDisplay = m < 10 && h > 0 ? `0${m}` : `${m}`;
    const sDisplay = s < 10 ? `0${s}` : `${s}`;

    return h > 0 ? `${h}:${mDisplay}:${sDisplay}` : `${m}:${sDisplay}`;
};

const HistoryItem: React.FC<HistoryItemProps> = ({ video, removeVideoFromWatchHistoryHandler }) => {
    const router = useRouter()
    return (
        <div className="group flex flex-col sm:flex-row gap-4 mb-4 relative rounded-xl hover:bg-[#272727] sm:hover:bg-transparent sm:p-0 p-2 transition-colors">
            {/* Thumbnail Container */}
            <div onClick={(e) => router.push(`/watch?v=${video?._id}`)} className="relative flex-shrink-0 w-full sm:w-[260px] aspect-video sm:rounded-xl overflow-hidden cursor-pointer">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
                    {formatDuration(video.duration)}

                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-600">
                    <div className="h-full bg-red-600 w-[70%]"></div> {/* Mock progress bar */}
                </div>
            </div>

            {/* Info Container */}
            <div className="flex-1 min-w-0 pr-8 pt-1">
                <div onClick={(e) => router.push(`/watch?v=${video?._id}`)} className="flex justify-between items-start">
                    <h3 className="text-white text-lg font-medium leading-6 mb-1 line-clamp-2 cursor-pointer hover:text-blue-400" title={video.title}>
                        {video.title}
                    </h3>
                </div>

                <div className="flex flex-row sm:flex-col text-[#aaaaaa] text-xs sm:text-sm">
                    <div className="flex items-center hover:text-white cursor-pointer mr-2 sm:mr-0 mb-1">
                        <span className="sm:hidden mr-1">•</span>
                        {video?.owner?.fullName}
                    </div>
                    <div className="flex items-center">
                        <span className="hidden sm:inline hover:text-white cursor-pointer">{video.views.toLocaleString()} views</span>
                        <span className="mx-1 hidden sm:inline">•</span>
                        <span>{timeAgo(video?.create)}</span>
                    </div>
                </div>

                <div className="hidden sm:block mt-3 text-[#aaaaaa] text-xs leading-4 line-clamp-2 max-w-[80%]">
                    {video?.description.length > 100 ? video?.description?.substring(0, 100) + "..." : video?.description}
                </div>
            </div>

            {/* Floating Action Buttons (Visible on Hover in Desktop) */}
            <div className="absolute right-0 top-0 sm:opacity-0 group-hover:opacity-100 transition-opacity flex flex-row sm:flex-col sm:items-end">
                <button onClick={() => removeVideoFromWatchHistoryHandler(video?._id)} className="p-2 text-white hover:bg-[#3f3f3f] rounded-full" title="Remove from watch history">
                    <X size={20} />
                </button>
                <button className="p-2 text-white hover:bg-[#3f3f3f] rounded-full" title="More actions">
                    <MoreVertical size={20} />
                </button>
            </div>
        </div>
    )
}

export default HistoryItem