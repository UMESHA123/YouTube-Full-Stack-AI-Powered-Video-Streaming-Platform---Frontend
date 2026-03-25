
"use client"
import React from 'react';
import { CheckCircle2, MoreVertical } from 'lucide-react';
// import { Video } from '../types';
// import { timeAgo, formatViews } from '../utils';
import { Video } from '@/types/types';
import { timeAgo, formatViews} from '@/utills';
import { useRouter } from 'next/navigation';

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
    const router = useRouter()
  return (
    <div onClick={() => router.push(`/watch?v=${video?._id}`)} className="flex flex-col gap-2 group cursor-pointer w-full">
      {/* Thumbnail Container */}
      <div className="relative rounded-xl overflow-hidden aspect-video bg-[#202020] w-full transition-all duration-300">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded-md text-[10px] sm:text-xs font-medium text-white tracking-wide">
          {video?.isLive ? "LIVE" : video.duration}
        </div>
        {video?.isLive && (
          <div className="absolute top-2 left-2 bg-red-600 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold text-white tracking-wide">
            LIVE NOW
          </div>
        )}
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-white/5 transition-colors duration-300 pointer-events-none" />
      </div>

      {/* Info Section */}
      <div className="flex gap-3 items-start px-1 sm:px-0 relative mt-1">
        {/* Channel Avatar */}
        <div className="shrink-0">
          <img
            src={video.owner.avatar}
            alt={video.owner.fullName}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover bg-[#272727]"
          />
        </div>

        {/* Text Content */}
        <div className="flex flex-col flex-1 min-w-0 pr-8">
          <h3 className="text-white font-semibold text-sm sm:text-base leading-tight line-clamp-2 mb-1 group-hover:text-blue-400 transition-colors">
            {video.title}
          </h3>

          <div className="text-[#aaa] text-xs sm:text-sm leading-snug">
            <div className="flex items-center gap-1 hover:text-white transition-colors w-fit group/author">
              <span className="font-normal truncate max-w-[150px] sm:max-w-none">
                {video.owner.fullName}
              </span>
              <CheckCircle2 size={12} className="text-[#aaa] fill-current shrink-0" />
            </div>

            <div className="flex items-center font-normal mt-0.5">
              <span>{formatViews(video.views)} views</span>
              <span className="mx-1 text-[8px] opacity-60">•</span>
              <span>{timeAgo(video.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Options Button */}
        <button
          className="absolute top-0 right-0 p-1.5 rounded-full hover:bg-[#272727] active:bg-[#3d3d3d] transition-all"
          aria-label="More options"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default VideoCard;
