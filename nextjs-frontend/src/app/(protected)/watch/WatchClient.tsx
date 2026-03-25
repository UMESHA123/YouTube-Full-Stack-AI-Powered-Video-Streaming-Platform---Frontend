"use client";

import { GetVideoById, GetSubscribersCount, ToggleSubscription, GetAllVideos } from "@/APIS";
import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MoreHorizontal, Share2 } from "lucide-react";
import { LikeDisLike } from "@/components/LikeDisLike";
import DrapdownMenuModel from "@/components/model/DrapdownMenuModel";
import { createPortal } from "react-dom";
import VideoActionModel from "@/components/model/VideoActionModel";
import Toast from "@/components/model/Toast";
import { VideoPlayComponent } from "@/components/VideoPlay";
import { VideoPlay } from "@/types/types";
import VideoSuggestion from "@/components/VideoSuggestion";
import { handleGetSubscribedStatus, timeAgo, formatNumber } from "@/utills";
import CommentSection from "@/components/CommentSection";
import { useYoutubecontext } from "@/contextAPI/YoutubeContextAPI";

function WatchSkeleton() {
  return (
    <div className="mt-14 max-w-[1800px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4 animate-pulse">
        <div className="aspect-video rounded-xl bg-[#272727]" />
        <div className="h-6 bg-[#272727] rounded w-3/4" />
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-[#272727]" />
          <div className="flex-1 h-10 bg-[#272727] rounded w-1/3" />
        </div>
      </div>
      <div className="lg:col-span-1 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="w-40 h-24 rounded-lg bg-[#272727] shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-[#272727] rounded w-full" />
              <div className="h-3 bg-[#272727] rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WatchPage() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("v");
  const router = useRouter();
  const [loading, setLoading] = useState(!!videoId);
  const [video, setVideo] = useState<VideoPlay | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [suggestedVideoIds, setSuggestedVideoIds] = useState<string[]>([]);

  const { subscribeStatus, setSubscribeStatus } = useYoutubecontext();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoId) return;
    const fetchSuggested = async () => {
      const res: any = await GetAllVideos({ page: 1, limit: 20, sortBy: "createdAt", sortType: "desc", userId: "" });
      if (res?.statusCode === 200 && res?.data?.length) {
        setSuggestedVideoIds(res.data.map((v: { _id: string }) => v._id));
      }
    };
    fetchSuggested();
  }, [videoId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!videoId) {
      setLoading(false);
      setError(null);
      setVideo(undefined);
      return;
    }
    setError(null);
    setLoading(true);
    const getVideo = async () => {
      try {
        const response = await GetVideoById(videoId);
        if (response?.statusCode === 200) {
          setVideo(response.data);
        } else {
          setError("Video not found or unavailable.");
        }
      } catch {
        setError("Failed to load video. Try again.");
      } finally {
        setLoading(false);
      }
    };
    getVideo();
  }, [videoId]);

  useEffect(() => {
    if (!video?.owner?._id) return;
    handleGetSubscribedStatus(video.owner._id, setSubscribeStatus);
  }, [video?.owner?._id]);

  useEffect(() => {
    if (!video?.owner?._id) return;
    GetSubscribersCount(video.owner._id).then((res: any) => {
      if (res?.statusCode === 200 && res?.data?.subscribersCount != null) {
        setSubscriberCount(res.data.subscribersCount);
      }
    });
  }, [video?.owner?._id]);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share && navigator.canShare?.({ url })) {
        await navigator.share({
          title: video?.title ?? "Video",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }
    } catch {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  const handleToggleSubscription = async (channelId: string) => {
    try {
      const response = await ToggleSubscription(channelId);
      if (response?.statusCode === 201 && response?.data?.isSubscribed === true) {
        handleGetSubscribedStatus(channelId, setSubscribeStatus);
        if (subscriberCount !== null) setSubscriberCount((c) => (c ?? 0) + 1);
      } else {
        handleGetSubscribedStatus(channelId, setSubscribeStatus);
        if (subscriberCount !== null && subscriberCount > 0) setSubscriberCount((c) => (c ?? 1) - 1);
      }
    } catch {
      handleGetSubscribedStatus(channelId, setSubscribeStatus);
    }
  };

  const handleOpenPlaylistModal = () => {
    setIsMenuOpen(false);
    setIsModalOpen(true);
  };

  if (!videoId) {
    return (
      <div className="mt-14 max-w-[1800px] mx-auto p-4 lg:p-6 flex flex-col items-center justify-center min-h-[50vh] text-center">
        <p className="text-gray-400 mb-4">Select a video to watch.</p>
        <button
          onClick={() => router.push("/")}
          className="bg-[#272727] hover:bg-[#3f3f3f] text-white font-medium py-2 px-6 rounded-full transition-colors"
        >
          Go to Home
        </button>
      </div>
    );
  }

  if (loading) {
    return <WatchSkeleton />;
  }

  if (error || !video) {
    return (
      <div className="mt-14 max-w-[1800px] mx-auto p-4 lg:p-6 flex flex-col items-center justify-center min-h-[50vh] text-center">
        <p className="text-gray-400 mb-4">{error ?? "Video not found."}</p>
        <button
          onClick={() => router.push("/")}
          className="bg-[#272727] hover:bg-[#3f3f3f] text-white font-medium py-2 px-6 rounded-full transition-colors"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="mt-14 max-w-[1800px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="flex flex-col">
          <VideoPlayComponent videoId={videoId} video={video} suggestedVideoIds={suggestedVideoIds} />
          <div className="flex items-center gap-2 mt-4 mb-2">
            <h1 className="text-xl font-bold text-white">{video.title}</h1>
            {video?.isLive && (
              <span className="bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded">
                LIVE NOW
              </span>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <img
                src={video.owner?.avatar}
                className="w-10 h-10 rounded-full"
                alt={video.owner?.username ?? "Channel"}
              />
              <div
                className="cursor-pointer"
                onClick={() => router.push(`/public/${video?.owner?._id}/`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && router.push(`/public/${video?.owner?._id}/`)}
              >
                <div className="font-bold text-white text-base">{video.owner?.username}</div>
                <div className="text-xs text-gray-400">
                  {subscriberCount != null ? `${formatNumber(subscriberCount)} subscribers` : "Subscribers"}
                </div>
              </div>
              <button
                onClick={() => handleToggleSubscription(video.owner!._id)}
                className="ml-4 bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors"
              >
                {subscribeStatus ? "Subscribed" : "Subscribe"}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#222] rounded-full overflow-hidden">
                <LikeDisLike initialLikes={0} video={video} />
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 bg-[#222] hover:bg-[#333] px-4 py-2 rounded-full text-white text-sm font-medium transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span>{shareCopied ? "Copied!" : "Share"}</span>
              </button>
            <div className="pl-2 shrink-0">
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${isMenuOpen ? "bg-[#3f3f3f]" : "bg-[#272727] hover:bg-[#3f3f3f]"}`}
                  aria-label="More actions"
                >
                  <MoreHorizontal size={20} />
                </button>
                <DrapdownMenuModel isMenuOpen={isMenuOpen} handleOpenPlaylistModal={handleOpenPlaylistModal} video={video} />
                {createPortal(
                  <VideoActionModel isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} isCreating={isCreating} setIsCreating={setIsCreating} video={video} />,
                  document.body
                )}
              </div>
              {createPortal(Toast(), document.body)}
            </div>
          </div>
        </div>
        <div className="bg-[#222] rounded-xl p-3 text-sm cursor-pointer hover:bg-[#2a2a2a] transition-colors">
          <div className="flex gap-2 font-bold text-white mb-1">
            <span>{video.views} views</span>
            <span>•</span>
            <span>{video?.isLive ? "Streaming now" : timeAgo(video.createdAt)}</span>
          </div>
          <p className="text-white whitespace-pre-line">
            {showMore ? (
              <>
                {video.description}{" "}
                <button className="text-white font-bold mt-1" onClick={() => setShowMore(false)}>Show less</button>
              </>
            ) : (
              <>
                {video.description.slice(0, 200)}
                {video.description.length > 200 ? "..." : ""}
                <button className="text-white font-bold mt-1" onClick={() => setShowMore(true)}>Show more</button>
              </>
            )}
          </p>
        </div>
        <CommentSection video={video} />
      </div>
      </div>
      <div className="lg:col-span-1">
        <VideoSuggestion video={video} videoId={videoId} />
      </div>
    </div>
  );
}
