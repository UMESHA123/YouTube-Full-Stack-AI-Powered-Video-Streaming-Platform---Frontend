"use client";
import { useYoutubecontext } from "@/contextAPI/YoutubeContextAPI";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import React, { useCallback, useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import VideoCardSkeleton from "./VideoCardSkeleton";
import { advancedVideoSearch, GetAllVideos } from "@/APIS";

const SKELETON_COUNT = 8;
const PAGE_SIZE = 10;

const VideosGrid = () => {
  const { videos, setVideos, searchQuery, selectedTopic, selectedTopicVideoIds } =
    useYoutubecontext();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortType, setSortType] = useState("desc");
  const [debouncedText, setDebouncedText] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const activeQuery = debouncedText.trim() || selectedTopic.trim();
  const isTopicMode = !debouncedText.trim() && !!selectedTopic.trim();

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    const response: any = await GetAllVideos({
      page: 1,
      limit: PAGE_SIZE,
      sortBy,
      sortType,
      userId: "",
    });
    if (response?.statusCode === 200 && response?.success === true) {
      setVideos(response.data ?? []);
      setPage(1);
      setHasMore((response.data?.length ?? 0) > 0);
    } else {
      setError("Failed to load videos. Try again.");
    }
    setLoading(false);
  }, [sortBy, sortType, setVideos]);

  useEffect(() => {
    if (activeQuery) {
      setLoading(true);
      setError(null);
      advancedVideoSearch(
        activeQuery,
        1,
        PAGE_SIZE,
        isTopicMode ? selectedTopicVideoIds : undefined
      ).then((response: any) => {
        if (response?.statusCode === 200 && response?.success === true) {
          setVideos(response.data ?? []);
          setPage(1);
          setHasMore((response.data?.length ?? 0) > 0);
        } else setError("No results found. Try a different search.");
        setLoading(false);
      });
    } else {
      setLoading(true);
      setError(null);
      GetAllVideos({ page: 1, limit: PAGE_SIZE, sortBy, sortType, userId: "" }).then((response: any) => {
        if (response?.statusCode === 200 && response?.success === true) {
          setVideos(response.data ?? []);
          setPage(1);
          setHasMore((response.data?.length ?? 0) > 0);
        } else setError("Failed to load videos. Try again.");
        setLoading(false);
      });
    }
  }, [debouncedText, activeQuery, isTopicMode, selectedTopicVideoIds, sortBy, sortType, setVideos]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    const apiCall = activeQuery
      ? advancedVideoSearch(
          activeQuery,
          nextPage,
          limit,
          isTopicMode ? selectedTopicVideoIds : undefined
        )
      : GetAllVideos({ page: nextPage, limit, sortBy, sortType, userId: "" });
    const response: any = await apiCall;
    if (response?.statusCode === 200 && response?.success === true) {
      const newData = response.data ?? [];
      setVideos((prev) => {
        const combined = [...prev, ...newData];
        return [...new Map(combined.map((v) => [v._id, v])).values()];
      });
      setPage(nextPage);
      setHasMore(newData.length > 0);
    }
    setLoadingMore(false);
  }, [
    page,
    limit,
    sortBy,
    sortType,
    activeQuery,
    isTopicMode,
    selectedTopicVideoIds,
    loadingMore,
    hasMore,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedText(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    loading: loadingMore,
    rootMargin: "300px",
  });

  const isSearchMode = !!activeQuery;

  if (loading && videos.length === 0) {
    return (
      <div className="flex-1 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error && videos.length === 0) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center py-16 text-center">
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={() => fetchVideos()}
          className="bg-[#272727] hover:bg-[#3f3f3f] text-white font-medium py-2 px-6 rounded-full transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full">
      {isSearchMode && (
        <h2 className="text-lg font-medium text-gray-300 mb-4">
          Search results for &quot;{activeQuery}&quot;
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
        {hasMore && videos.length > 0 && (
          <div ref={sentinelRef} className="col-span-full h-4" aria-hidden />
        )}
      </div>

      {videos.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-gray-400">
            {isSearchMode ? "No videos match your search." : "No videos yet. Check back later."}
          </p>
        </div>
      )}

      {loadingMore && videos.length > 0 && (
        <div className="col-span-full flex justify-center py-4">
          <span className="text-sm text-gray-500">Loading more…</span>
        </div>
      )}
    </div>
  );
};

export default VideosGrid;
