"use client";
import { Video } from "@/types/types";
import { timeAgo, formatViews } from "@/utills";
import { useRouter } from "next/navigation";
import React from "react";

type RecommendationCardType = { video: Video };

const RecommendationCard: React.FC<RecommendationCardType> = ({ video }) => {
  const router = useRouter();

  return (
    <div>
      <div
        className="flex gap-3 group cursor-pointer"
        onClick={() => router.push(`/watch?v=${video?._id}`)}
      >
        <div className="relative w-[168px] shrink-0 aspect-video rounded-lg overflow-hidden bg-[#202020]">
          <img
            src={video?.thumbnail}
            alt={video?.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
            {video?.isLive ? "LIVE" : video?.duration}
          </span>
          {video?.isLive && (
            <span className="absolute top-1 left-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">
              LIVE
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-white line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
            {video?.title}
          </h4>
          <div className="text-xs text-gray-400">
            <div className="truncate">{video?.owner?.fullName}</div>
            <div>{formatViews(video?.views ?? 0)} views · {timeAgo(video?.createdAt)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard
