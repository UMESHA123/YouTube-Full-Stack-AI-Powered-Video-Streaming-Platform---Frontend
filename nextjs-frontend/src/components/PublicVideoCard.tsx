import { Video } from '@/types/types';
import { MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'

const PublicVideoCard = ({ video }: { video: Video }) => {
    const router = useRouter()
    return (
        <div onClick={() => router.push(``)} className="flex flex-col gap-2 group cursor-pointer">
            {/* Thumbnail Container */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-[#2a2a2a]">
                {false ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 animate-pulse">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                        <span className="text-sm font-medium text-blue-400">Creating with Veo...</span>
                    </div>
                ) : (
                    <>
                        {false ? (
                            <video
                                src={video.videoFile}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                controls
                                muted
                            />
                        ) : (
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                        )}
                        {!video.videoFile && <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-xs font-medium">
                            {video.duration}
                        </div>}
                    </>
                )}
            </div>

            {/* Info */}
            <div className="flex gap-3 items-start">
                <div className="flex-1">
                    <h3 className="text-sm font-semibold line-clamp-2 leading-tight text-white group-hover:text-blue-400 transition-colors">
                        {video.title}
                    </h3>
                    <div className="text-xs text-[#aaaaaa] mt-1 flex items-center">
                        <span>{video.views} views</span>
                        {/* <span className="mx-1">•</span>
            <span>{timeAgo()}</span> */}
                    </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#272727] rounded-full">
                    <MoreVertical className="w-4 h-4 text-white" />
                </button>
            </div>
        </div>
    );
  
}

export default PublicVideoCard