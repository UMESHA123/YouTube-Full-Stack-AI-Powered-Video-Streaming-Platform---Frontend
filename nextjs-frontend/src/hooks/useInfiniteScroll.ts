"use client";

import { useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollOptions {
  onLoadMore: () => void | Promise<void>;
  hasMore: boolean;
  loading: boolean;
  rootMargin?: string;
  threshold?: number;
}

/**
 * Reusable infinite scroll hook using IntersectionObserver.
 * Triggers onLoadMore when the sentinel element enters the viewport.
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  loading,
  rootMargin = "200px",
  threshold = 0,
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await onLoadMore();
  }, [onLoadMore, hasMore, loading]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, hasMore, loading, rootMargin, threshold]);

  return { sentinelRef };
}
