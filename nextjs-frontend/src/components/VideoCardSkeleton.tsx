"use client";

import React from "react";

export default function VideoCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 w-full animate-pulse">
      <div className="relative rounded-xl overflow-hidden aspect-video bg-[#272727] w-full" />
      <div className="flex gap-3 items-start px-1 sm:px-0 mt-1">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#272727] shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 bg-[#272727] rounded w-full max-w-[90%]" />
          <div className="h-4 bg-[#272727] rounded w-3/4" />
          <div className="h-3 bg-[#272727] rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}
