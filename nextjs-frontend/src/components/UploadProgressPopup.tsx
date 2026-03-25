"use client";

import React from "react";
import { Upload, X } from "lucide-react";
import { useYoutubecontext } from "@/contextAPI/YoutubeContextAPI";

export default function UploadProgressPopup() {
  const { uploadState, setUploadState } = useYoutubecontext();

  if (!uploadState.isActive) return null;

  const handleClose = () => {
    setUploadState({
      isActive: false,
      progress: 0,
      isComplete: false,
      data: null,
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-[320px] bg-[#1f1f1f] border border-[#333] rounded-xl shadow-2xl overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-[#272727] flex items-center justify-center shrink-0">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {uploadState.data?.title ?? "Uploading video..."}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {uploadState.isComplete
                  ? uploadState.data?.description ?? "Complete"
                  : `${uploadState.progress}%`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-[#333] text-gray-400 hover:text-white transition-colors shrink-0"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {!uploadState.isComplete && (
          <div className="mt-3 h-1.5 bg-[#333] rounded-full overflow-hidden">
            <div
              className="h-full bg-red-600 rounded-full transition-all duration-300"
              style={{ width: `${uploadState.progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
