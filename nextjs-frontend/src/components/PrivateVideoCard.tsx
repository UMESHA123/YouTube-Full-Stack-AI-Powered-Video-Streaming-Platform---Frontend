import { Video } from "@/types/types";
import { timeAgo } from "@/utills";
import { Check, Edit2, MoreVertical, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const PrivateVideoCard: React.FC<{
    video: Video;
    isOwner?: boolean;
    onDelete?: (id: string) => void;
    onUpdate?: (id: string, updates: Partial<Video>) => void;
    handleVideoDelete: (videoid: string) => {}
}> = ({ video, isOwner, onDelete, onUpdate, handleVideoDelete }) => {

    const [isRenaming, setIsRenaming] = useState(false);
    const [newTitle, setNewTitle] = useState(video.title);
    const router = useRouter()

    const handleRename = () => {
        if (newTitle.trim() && onUpdate) {
            onUpdate(video._id, { title: newTitle });
            setIsRenaming(false);
        }
    };

    return (
        <div onClick={() => router.push(`/watch?v=${video?._id}`)} className="flex flex-col gap-2 group cursor-pointer relative">
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
                                className="w-full h-full object-cover"
                                controls={!isRenaming}
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

                {true && (
                    <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsRenaming(true); }}
                            className="p-1.5 bg-black/60 rounded hover:bg-black/80 text-white backdrop-blur-sm"
                            title="Edit Video"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleVideoDelete?.(video._id); }}
                            className="p-1.5 bg-red-600/80 rounded hover:bg-red-600 text-white backdrop-blur-sm"
                            title="Delete Video"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex gap-3 items-start">
                <div className="flex-1 min-w-0">
                    {isRenaming ? (
                        <div className="flex items-start gap-1">
                            <textarea
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="w-full bg-[#1f1f1f] border border-[#3f3f3f] rounded p-1 text-sm text-white focus:outline-none resize-none h-14"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                            />
                            <div className="flex flex-col gap-1">
                                <button onClick={(e) => { e.stopPropagation(); handleRename(); }} className="text-green-500 hover:text-green-400"><Check className="w-4 h-4" /></button>
                                <button onClick={(e) => { e.stopPropagation(); setIsRenaming(false); }} className="text-red-500 hover:text-red-400"><X className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-sm font-semibold line-clamp-2 leading-tight text-white group-hover:text-blue-400 transition-colors">
                                {video.title}
                            </h3>

                            <div className="text-xs text-[#aaaaaa] mt-1 flex items-center">
                                <span>{video.views} views</span>
                                <span className="mx-1">•</span>
                                <span>{timeAgo(video?.createdAt)}</span>
                            </div>
                        </>
                    )}
                </div>
                {!isOwner && (
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#272727] rounded-full">
                        <MoreVertical className="w-4 h-4 text-white" />
                    </button>
                )}
            </div>
        </div>
    );
};
