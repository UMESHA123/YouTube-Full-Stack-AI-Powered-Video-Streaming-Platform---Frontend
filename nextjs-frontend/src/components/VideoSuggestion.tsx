"use client";
import { GetAllVideos, GetUserTweets } from "@/APIS";
import { useYoutubecontext } from "@/contextAPI/YoutubeContextAPI";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { SocialTweet, Video, VideoPlay } from "@/types/types";
import React, { useCallback, useEffect, useState } from "react";
import VideoPlaylist from "./VideoPlaylist";
import VideoAssistant from "./VideoAssistant";
import SocialPost from "./SocialPost";
import RecommendationCard from "./RecommendationCard";

type VideoSuggestionType = { videoId: string; video: VideoPlay };
const ITEMS_PER_PAGE = 5;
const PAGE_SIZE = 10;
const TWEET_ROTATE_INTERVAL_MS = 5000;

const VideoSuggestion: React.FC<VideoSuggestionType> = ({ videoId, video }) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortType, setSortType] = useState("desc");
  const [recommendedVideos, setRecommendedVideos] = useState<Video[]>([]);
  const [socialTweets, setSocialTweets] = useState<SocialTweet[]>([]);
  const [activeTweetIndex, setActiveTweetIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { isVideoPlaylistActive, videoPlaylist } = useYoutubecontext();

  useEffect(() => {
    if (isVideoPlaylistActive) {
      const idx = videoPlaylist.findIndex((v) => v._id === videoId);
      if (idx >= 0) setCurrentPage(Math.floor(idx / ITEMS_PER_PAGE));
    }
  }, [videoId, isVideoPlaylistActive, videoPlaylist.length]);

  const totalPages = Math.ceil(videoPlaylist.length / ITEMS_PER_PAGE);
  const handlePrevPage = () => setCurrentPage((p) => Math.max(0, p - 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1));

  useEffect(() => {
    setLoading(true);
    GetAllVideos({ page: 1, limit: PAGE_SIZE, sortBy, sortType, userId: "" }).then((res: any) => {
      if (res?.statusCode === 200 && res?.success === true) {
        setRecommendedVideos(res.data ?? []);
        setPage(1);
        setHasMore((res.data?.length ?? 0) >= PAGE_SIZE);
      }
      setLoading(false);
    });
  }, [videoId]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const nextPage = page + 1;
    const res: any = await GetAllVideos({ page: nextPage, limit, sortBy, sortType, userId: "" });
    if (res?.statusCode === 200 && res?.success === true) {
      const newData = res.data ?? [];
      setRecommendedVideos((prev) => {
        const combined = [...prev, ...newData];
        return Array.from(new Map(combined.map((v) => [v._id, v])).values());
      });
      setPage(nextPage);
      setHasMore(newData.length >= limit);
    }
    setLoading(false);
  }, [page, limit, sortBy, sortType, loading, hasMore]);

  const { sentinelRef } = useInfiniteScroll({ onLoadMore: loadMore, hasMore, loading, rootMargin: "200px" });

  useEffect(() => {
    if (!video?.owner?._id) return;
    GetUserTweets(video.owner._id).then((res: any) => {
      if (res?.statusCode === 200 && Array.isArray(res?.data)) {
        setSocialTweets(res.data);
        setActiveTweetIndex(0);
      } else {
        setSocialTweets([]);
        setActiveTweetIndex(0);
      }
    });
  }, [videoId, video?.owner?._id]);

  useEffect(() => {
    if (socialTweets.length <= 1) return;
    const timer = setInterval(() => {
      setActiveTweetIndex((prev) => (prev + 1) % socialTweets.length);
    }, TWEET_ROTATE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [socialTweets]);

  const currentTweet = socialTweets[activeTweetIndex];

    return (
        <aside className="flex flex-col">
            {isVideoPlaylistActive && <div className="flex-1 min-h-[40%] flex flex-col mb-10">
                <VideoPlaylist
                    videoId={videoId}
                    currentPage={currentPage}
                    ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                    totalPages={totalPages}
                    handlePrevPage={handlePrevPage}
                    handleNextPage={handleNextPage}
                />
            </div>
            }
            <VideoAssistant video={video}/>

            {currentTweet && <SocialPost tweet={currentTweet} />}

            <div className="flex flex-col gap-3">
                {recommendedVideos.map((v) => (
                    <RecommendationCard key={v._id} video={v} />
                ))}
                {hasMore && <div ref={sentinelRef} className="h-4 shrink-0" aria-hidden />}
                {loading && recommendedVideos.length > 0 && (
                    <div className="text-xs text-gray-500 py-2">Loading...</div>
                )}
            </div>
        </aside>
    )
}

export default VideoSuggestion
